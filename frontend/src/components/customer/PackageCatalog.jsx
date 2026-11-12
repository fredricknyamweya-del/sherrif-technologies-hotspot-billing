import { useEffect, useState } from "react";
import { ArrowRight, Check, Clock3, Wifi } from "lucide-react";
import { Link } from "react-router";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import ErrorState from "@/components/ui/ErrorState";
import LoadingState from "@/components/ui/LoadingState";
import StatusBadge from "@/components/ui/StatusBadge";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatDuration } from "@/lib/format";

const categoryLabels = {
  quick: "Quick connect",
  hourly: "Hourly",
  daily: "Daily",
  "long-term": "Long-term",
};

function PackageCard({ item }) {
  return (
    <article className={`package-card${item.featured ? " is-featured" : ""}`}>
      {item.featured && <span className="package-featured">Popular</span>}
      <div className="package-card-top">
        <span className="package-card-icon">
          <Wifi size={19} aria-hidden="true" />
        </span>
        <StatusBadge status={item.status} />
      </div>
      <span className="package-category">{categoryLabels[item.category] ?? "Other"}</span>
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="package-price">
        {formatCurrency(item.price)}
        <span> / package</span>
      </div>
      <div className="package-facts">
        <span>
          <Clock3 size={15} aria-hidden="true" /> {formatDuration(item.durationMinutes)}
        </span>
        <span>
          <Check size={15} aria-hidden="true" />{" "}
          {item.dataLimitGb ? `${item.dataLimitGb} GB` : "Unlimited data"}
        </span>
      </div>
      <Button
        as={Link}
        to={`/payment?package=${encodeURIComponent(item.id)}`}
        className="package-buy"
      >
        Choose package <ArrowRight size={16} aria-hidden="true" />
      </Button>
    </article>
  );
}

export default function PackageCatalog() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    apiRequest("/portal/packages")
      .then((result) => {
        if (active) setPackages(Array.isArray(result) ? result : (result?.packages ?? []));
      })
      .catch((requestError) => {
        if (active) setError(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);

  if (loading) return <LoadingState label="Loading available packages" />;
  if (error) {
    return <ErrorState message={error.message} onRetry={() => setRetry((value) => value + 1)} />;
  }
  if (packages.length === 0) {
    return (
      <EmptyState
        title="No packages available"
        description="Please check back soon or contact customer care."
      />
    );
  }

  return (
    <div className="package-grid">
      {packages.map((item) => (
        <PackageCard item={item} key={item.id} />
      ))}
    </div>
  );
}
