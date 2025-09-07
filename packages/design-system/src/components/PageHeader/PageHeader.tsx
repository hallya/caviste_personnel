interface PageHeaderProps {
  isHomePage?: boolean;
}

export default function PageHeader({ isHomePage = false }: PageHeaderProps) {
  // Use H1 for homepage SEO, div for other pages to avoid multiple H1s
  const HeaderElement = isHomePage ? "h1" : "div";

  return (
    <div className="pt-8 pb-4">
      <HeaderElement className="text-center text-title text-primary-600">
        Edouard, Caviste personnel
      </HeaderElement>
    </div>
  );
}
