import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  matchQuestion,
  generateSalesReply,
  MATCH_CONFIDENCE_THRESHOLD,
} from './salesAgent.mjs';
import { faqGroups } from '../src/data/faqQA.js';

describe('matchQuestion', () => {
  test('matches "how much is a month to month membership" to the open-gym pricing FAQ', () => {
    const result = matchQuestion('how much is a month to month membership', faqGroups);
    assert.ok(result, 'expected a match');
    assert.equal(result.entry.question, 'What does an open-gym membership cost?');
    assert.ok(result.confidence >= MATCH_CONFIDENCE_THRESHOLD);
  });

  test('matches "do you have a free trial" to the free-trial FAQ', () => {
    const result = matchQuestion('do you have a free trial', faqGroups);
    assert.ok(result, 'expected a match');
    assert.equal(result.entry.question, 'Do you offer a free trial?');
  });

  test('does NOT confidently match "do you sell protein shakes"', () => {
    const result = matchQuestion('do you sell protein shakes', faqGroups);
    assert.equal(result, null);
  });

  test('returns null for empty/whitespace-only input', () => {
    assert.equal(matchQuestion('', faqGroups), null);
    assert.equal(matchQuestion('   ', faqGroups), null);
  });

  test('returns null against an empty faqGroups list', () => {
    assert.equal(matchQuestion('do you have a free trial', []), null);
  });
});

describe('generateSalesReply', () => {
  test('resolves to { mode: "disabled" } when OLLAMA_ENDPOINT is not configured — the single most important safety property', async () => {
    // No endpoint in config at all — simulates process.env.OLLAMA_ENDPOINT unset.
    const config = { endpoint: '', model: '', apiKey: '', timeoutMs: 9000 };

    // Inject a callOllama that would throw if it were ever reached, proving
    // the disabled path short-circuits before any network call is attempted.
    const spyCallOllama = () => {
      throw new Error('callOllama should never be invoked when disabled');
    };

    const result = await generateSalesReply(
      { name: 'Test Visitor', email: 'test@example.com', message: 'do you have a free trial' },
      config,
      { callOllama: spyCallOllama, faqGroups },
    );

    assert.deepEqual(result, { mode: 'disabled' });
  });

  test('resolves to { mode: "disabled" } when config is undefined entirely', async () => {
    const result = await generateSalesReply(
      { name: 'Test Visitor', email: 'test@example.com', message: 'do you have a free trial' },
      undefined,
    );
    assert.deepEqual(result, { mode: 'disabled' });
  });

  test('resolves to { mode: "deflected" } on a mocked Ollama timeout, never throws', async () => {
    const config = { endpoint: 'http://fake-ollama:11434', model: 'llama3', timeoutMs: 9000 };
    const mockCallOllama = async () => ({ ok: false, error: 'Ollama request timed out after 9000ms' });

    const result = await generateSalesReply(
      { name: 'Test Visitor', email: 'test@example.com', message: 'do you have a free trial' },
      config,
      { callOllama: mockCallOllama, faqGroups },
    );

    assert.equal(result.mode, 'deflected');
    assert.match(result.reason, /timed out/);
  });

  test('resolves to { mode: "deflected" } on a mocked Ollama non-2xx error, never throws', async () => {
    const config = { endpoint: 'http://fake-ollama:11434', model: 'llama3', timeoutMs: 9000 };
    const mockCallOllama = async () => ({ ok: false, error: 'Ollama responded with status 500' });

    const result = await generateSalesReply(
      { name: 'Test Visitor', email: 'test@example.com', message: 'do you have a free trial' },
      config,
      { callOllama: mockCallOllama, faqGroups },
    );

    assert.equal(result.mode, 'deflected');
  });

  test('resolves to { mode: "deflected" } when callOllama throws unexpectedly, never propagates the throw', async () => {
    const config = { endpoint: 'http://fake-ollama:11434', model: 'llama3', timeoutMs: 9000 };
    const explodingCallOllama = async () => {
      throw new Error('unexpected network stack error');
    };

    const result = await generateSalesReply(
      { name: 'Test Visitor', email: 'test@example.com', message: 'do you have a free trial' },
      config,
      { callOllama: explodingCallOllama, faqGroups },
    );

    assert.equal(result.mode, 'deflected');
  });

  test('resolves to { mode: "deflected" } when there is no confident FAQ match, without calling Ollama', async () => {
    const config = { endpoint: 'http://fake-ollama:11434', model: 'llama3', timeoutMs: 9000 };
    const spyCallOllama = () => {
      throw new Error('callOllama should never be invoked when there is no match');
    };

    const result = await generateSalesReply(
      { name: 'Test Visitor', email: 'test@example.com', message: 'do you sell protein shakes' },
      config,
      { callOllama: spyCallOllama, faqGroups },
    );

    assert.equal(result.mode, 'deflected');
  });

  test('resolves to { mode: "answered" } on a mocked successful Ollama call with a confident match', async () => {
    const config = { endpoint: 'http://fake-ollama:11434', model: 'llama3', timeoutMs: 9000 };
    const mockCallOllama = async () => ({ ok: true, text: 'Yes! Come try a free session, no strings attached.' });

    const result = await generateSalesReply(
      { name: 'Test Visitor', email: 'test@example.com', message: 'do you have a free trial' },
      config,
      { callOllama: mockCallOllama, faqGroups },
    );

    assert.equal(result.mode, 'answered');
    assert.equal(result.matchedQuestion, 'Do you offer a free trial?');
    assert.equal(result.replyText, 'Yes! Come try a free session, no strings attached.');
    assert.ok(result.confidence > 0);
  });
});
