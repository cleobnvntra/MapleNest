import MainPageContainer from "../MainPageContainer";
import initTranslations from "../translation/utils/i18n";
import TranslationsProvider from "../translation/providers/TranslationProvider";
import Header from "../Header";
import Link from "next/link";

const i18nNamespaces = ["default"];

export default async function Home({ params: { locale } }) {
  const { resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <div className="w-[90%] relative tablet-xl:w-[80%] mx-auto">
      <TranslationsProvider
        namespaces={i18nNamespaces}
        locale={locale}
        resources={resources}
      >
        <Header />
        <div className="mt-3 flex-col gap-7 flex">
          <MainPageContainer />
        </div>
      </TranslationsProvider>
    </div>
  );
}
