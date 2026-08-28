type DashboardCardProps = {
  title: string;
  value: string;
  color: string;
};

export default function DashboardCard({
  title,
  value,
  color,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition duration-300">

      <h3 className="text-black text-sm">
        {title}
      </h3>

      <p className={`text-4xl font-bold mt-2 ${color}`}>
        {value}
      </p>

    </div>
  );
}