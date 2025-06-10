import Accessibility from "@/components/Accessibility/Accessibility";
import DeleteCompte from "@/components/DeleteCompte/DeleteCompte";
import Language from "@/components/Language/Language";
import Theme from "@/components/Theme/Theme";

function Settings() {
  return (
    <section className="mx-auto max-w-[1200px] overflow-hidden rounded-2xl bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold mb-8 text-center">Paramètres</h1>

        <Theme />

        <Accessibility />

        <Language />

        <DeleteCompte />
    </section>
  );
}

export default Settings;
