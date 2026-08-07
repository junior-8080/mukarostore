const BADGES = [
  {
    icon: "🚀",
    title: "Same-day delivery in Accra",
    subtitle: "Order before 12pm for same-day",
  },
  {
    icon: "🛡️",
    title: "Genuine Products Only",
    subtitle: "Every item vetted before listing",
  },
  {
    icon: "📦",
    title: "Free delivery over GHS 200",
    subtitle: "No minimum on bundles",
  },
  {
    icon: "☎️",
    title: "WhatsApp Support",
    subtitle: "Real humans, fast replies",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-10 border-b border-gray-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BADGES.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center gap-2 py-4"
            >
              <span className="text-3xl">{badge.icon}</span>
              <p className="font-heading font-bold text-brand-navy text-sm">
                {badge.title}
              </p>
              <p className="text-gray-muted text-xs font-body">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
