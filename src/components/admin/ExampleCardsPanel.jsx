import { supabase } from "../../supabaseClient.js";

const BUCKET = "card-images";

const EXAMPLES = [
  { path: "Icons.jpg", label: "Icons" },
  { path: "Character.jpg", label: "Character" },
  { path: "Starship.jpg", label: "Starship" },
  { path: "Vehicle.jpg", label: "Vehicle" },
  { path: "Weapon.jpg", label: "Weapon" },
   // { path: "Device.jpg", label: "Device" },
 // { path: "Effect.jpg", label: "Effect" },
    { path: "Interrupt.jpg", label: "Interrupt" },
  { path: "Site.jpg", label: "Site" },
  { path: "Planet.jpg", label: "Planet" },
];

function getPublicUrl(path) {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? "";
}

export default function ExampleCardsPanel() {
  return (
    <section>
      <h2>Voorbeelden</h2>

      <div className="example-grid">
        {EXAMPLES.map((ex) => {
          const url = getPublicUrl(ex.path);

          return (
            <figure key={ex.path} className="example-item">
              <img className="example-img" src={url} alt={ex.label} loading="eager"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/placeholder.jpg";
                                  }}
                />
              <figcaption>{ex.label}</figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}