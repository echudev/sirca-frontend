import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface CardCabinaProps {
  label: string;
  icon: React.ReactNode;
  value: string | number | null;
}

const CardCabina = ({ label, icon, value }: CardCabinaProps) => {
  return (
    <Card className="flex flex-col gap-1 px-3 py-2 bg-gradient-to-br from-accent/30 to-accent/25 border border-primary/30 shadow-sm shadow-black/20 cursor-pointer hover:shadow-md transition-all">
      <CardTitle className="text-xs font-medium text-primary/80">
        {label}
      </CardTitle>
      <CardContent className="flex items-center justify-between text-primary/80 p-0">
        {icon}
        <span className="font-semibold text-sm">{value}</span>
      </CardContent>
    </Card>
  );
};

export default CardCabina;
