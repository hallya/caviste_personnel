import PageHeader from "../../components/pageHeader";

export default function ContactView() {
  return (
    <main className="min-h-screen">
      <PageHeader />

      <div className="bg-primary-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <header className="text-center mb-12">
            <h1 className="text-title text-primary-800 mb-6">
              Contact & À propos
            </h1>
            <p className="text-body text-neutral-700 text-lg leading-relaxed max-w-3xl mx-auto">
              Je souhaite faire découvrir à des clients qui n&apos;y ont pas
              forcément accès, des vins de vignerons que l&apos;on trouve
              généralement dans des restaurants étoilés ou de bons cavistes
              indépendants.
            </p>
          </header>

          <div className="grid lg:grid-cols-2 gap-12">
            <section>
              <h2 className="text-subtitle text-primary-700 mb-6">
                À propos d&apos;Edouard
              </h2>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 space-y-4">
                <p className="text-body text-neutral-700 leading-relaxed">
                  Mon souhait est de rendre les vins accessibles au quotidien et
                  pour vos événements privés ou d&apos;entreprise.
                </p>

                <p className="text-body text-neutral-700 leading-relaxed">
                  Jeune, j&apos;ai baigné avec une partie de ma famille
                  vignerons à Saint-Émilion en grand cru depuis 1750 de père en
                  fils. Château Brun, famille Brun.
                </p>

                <p className="text-body text-neutral-700 leading-relaxed">
                  Plus tard j&apos;ai créé 2 clubs œnologie et travaillé dans
                  une cave à vin événementiel pendant 5 ans pour financer mes
                  études d&apos;ingénieurs.
                </p>

                <p className="text-body text-neutral-700 leading-relaxed">
                  Par la suite j&apos;ai été responsable de la cave, de
                  l&apos;épicerie et de la logistique de la Maison Plisson à
                  Beaumarchais Paris 3ème pendant 7 ans (800 références de vins
                  en agriculture raisonnée).
                </p>
              </div>

              <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <h3 className="text-heading text-primary-600 mb-4">
                  Mes Services
                </h3>
                <ul className="space-y-3 text-body text-neutral-700">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Sélection personnalisée de vins de vignerons
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Conseils et accords mets-vins
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Formations et dégustations privées
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Livraison sur mesure
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    Tarifs négociés pour mes clients
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-subtitle text-primary-700 mb-6">
                Me Contacter
              </h2>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 space-y-6">
                <div>
                  <h3 className="text-heading text-primary-600 mb-3">
                    Pour vos demandes
                  </h3>
                  <p className="text-body text-neutral-700 leading-relaxed mb-4">
                    N&apos;hésitez pas à me contacter pour toute question sur
                    mes sélections, pour organiser une dégustation ou simplement
                    pour échanger sur l&apos;univers du vin.
                  </p>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>
                      <span className="font-medium">Email :</span>
                      <a
                        href="mailto:edouard.dulac@gmail.com"
                        className="text-primary-600 hover:text-primary-700 ml-2"
                      >
                        edouard.dulac@gmail.com
                      </a>
                    </p>
                    <p>
                      <span className="font-medium">Téléphone :</span>
                      <a
                        href="tel:+33613516233"
                        className="text-primary-600 hover:text-primary-700 ml-2"
                      >
                        +33 6 13 51 62 33
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-heading text-primary-600 mb-3">
                    Horaires de disponibilité
                  </h3>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <p>Lundi - Vendredi : 9h - 18h</p>
                    <p>Samedi : 10h - 16h</p>
                    <p>Dimanche : Sur rendez-vous</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-heading text-primary-600 mb-3">
                    Zone de livraison
                  </h3>
                  <div className="space-y-3 text-sm text-neutral-600">
                    <p>
                      <strong>
                        Livraison sur Paris Centre et Île-de-France
                        essentiellement
                      </strong>
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>
                          Livraison gratuite à vélo sur Paris Centre à partir
                          d&apos;une caisse
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>
                          Livraison gratuite en main propre en Île-de-France à
                          partir de 4 caisses
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>Créneaux de livraison sur mesure</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-heading text-primary-600 mb-3">
                    Stock et disponibilité
                  </h3>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <p>
                      <strong>
                        Stock de plusieurs centaines de références
                      </strong>{" "}
                      pour livraison express
                    </p>
                    <p>
                      <strong>
                        Accès à tous les vins adoubés par le guide Vert de la
                        RVF
                      </strong>{" "}
                      en seulement 5 jours
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-primary-100 p-4 rounded-lg border border-primary-200">
                <p className="text-sm text-primary-800">
                  <span className="font-medium">
                    Envie de découvrir nos formations ?
                  </span>
                  <br />
                  Consultez notre page{" "}
                  <a
                    href="/formations"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    Formations en Œnologie
                  </a>{" "}
                  pour en savoir plus.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
