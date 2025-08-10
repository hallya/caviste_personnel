import PageHeader from "../../components/PageHeader";
import type { FormationFormData, SubmitStatus } from "../types";
import { FORM_CONFIG } from "../constants";

interface FormationsViewProps {
  formData: FormationFormData;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSubmitting: boolean;
  submitStatus: SubmitStatus;
}

export default function FormationsView({ 
  formData, 
  onSubmit, 
  onChange, 
  isSubmitting, 
  submitStatus 
}: FormationsViewProps) {

  return (
    <main className="min-h-screen">
      <PageHeader />
      
      <div className="bg-primary-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-title text-primary-800 mb-6">
            Formations en Œnologie
          </h1>
          <p className="text-body text-neutral-700 text-lg leading-relaxed max-w-3xl mx-auto">
            Développez votre palais et votre connaissance des vins avec des formations personnalisées. 
            Découverte des terroirs, techniques de dégustation et accords mets-vins.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <section>
            <h2 className="text-subtitle text-primary-700 mb-6">
              Nos Formations
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h3 className="text-heading text-primary-600 mb-3">
                  Initiation à la Dégustation
                </h3>
                <p className="text-body text-neutral-600 mb-4">
                  Apprenez les bases de la dégustation : analyse visuelle, olfactive et gustative. 
                  Développez votre vocabulaire œnologique.
                </p>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Durée : 2h</li>
                  <li>• Groupe : 2-6 personnes</li>
                  <li>• 6 vins de terroirs différents</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h3 className="text-heading text-primary-600 mb-3">
                  Découverte des Terroirs
                </h3>
                <p className="text-body text-neutral-600 mb-4">
                  Voyage à travers les régions viticoles françaises. Comprenez l&apos;influence 
                  du terroir sur le caractère des vins.
                </p>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Durée : 3h</li>
                  <li>• Groupe : 2-8 personnes</li>
                  <li>• 8 vins représentatifs</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h3 className="text-heading text-primary-600 mb-3">
                  Accords Mets et Vins
                </h3>
                <p className="text-body text-neutral-600 mb-4">
                  Maîtrisez l&apos;art des accords. Apprenez à associer vins et mets 
                  pour sublimer vos repas.
                </p>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Durée : 2h30</li>
                  <li>• Groupe : 2-6 personnes</li>
                  <li>• Dégustation avec bouchées</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-subtitle text-primary-700 mb-6">
              Demande d&apos;Information
            </h2>
            
            <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    Votre demande a été envoyée avec succès. Je vous recontacterai rapidement.
                  </p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    Une erreur s&apos;est produite. Veuillez réessayer ou me contacter directement.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={FORM_CONFIG.MESSAGE_TEXTAREA_ROWS}
                    value={formData.message}
                    onChange={onChange}
                    placeholder="Précisez le type de formation qui vous intéresse, vos disponibilités, le nombre de participants..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </div>
            </form>
          </section>
        </div>
        </div>
      </div>
    </main>
  );
}