import PagePose from '../components/ui/PagePose.jsx';
import Container from '../components/ui/Container.jsx';
import Button from '../components/ui/Button.jsx';
import { site } from '../lib/site.js';

export default function NotFound() {
  return (
    <PagePose>
      <section className="section">
        <Container className="text-center">
          <span className="eyebrow justify-center">Page not found</span>
          <h1 className="mt-4 display-1 text-white">404</h1>
          <p className="mx-auto mt-6 max-w-xl body-lg">
            The page you're looking for isn't here. Head back home, or jump to our services or
            membership options.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button to="/">Back home</Button>
            <Button to={site.ctas.pricing.to} variant="ghost" icon={false}>
              Membership
            </Button>
          </div>
        </Container>
      </section>
    </PagePose>
  );
}
