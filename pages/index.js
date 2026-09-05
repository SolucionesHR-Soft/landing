import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import SolucionesSection from '../components/SolucionesSection';
import ProductosSection from '../components/ProductosSection';
import ReposSection from '../components/ReposSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>HRD Soluciones HR — Software, IA y Hardware</title>
        <meta name="description" content="Desarrollamos software, agentes de inteligencia artificial y soluciones de hardware a medida." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main>
        <Hero />
        <SolucionesSection />
        <ProductosSection />
        <ReposSection />

        <section id="contacto" className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <p className="tag-label mb-2">contacto</p>
            <h2 className="font-serif text-3xl mb-8">Cuéntanos qué necesitas construir</h2>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
