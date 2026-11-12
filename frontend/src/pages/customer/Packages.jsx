import PackageCatalog from "@/components/customer/PackageCatalog";

export default function Packages() {
  return (
    <div className="portal-page">
      <header className="portal-page-heading">
        <span className="eyebrow">Find your connection</span>
        <h1>Wi-Fi packages</h1>
        <p>Choose the access that fits your day. All prices are in Kenyan shillings.</p>
      </header>
      <PackageCatalog />
    </div>
  );
}
