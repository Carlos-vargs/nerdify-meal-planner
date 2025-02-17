import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { MenuItem, MenuDay } from "@/types"; // Import the interfaces

interface DishFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (dish: MenuItem) => void;
  initialDish?: MenuItem | null;
  daysInRange: string[];
  menuDays: MenuDay[];
}

const DishForm = ({
  isOpen,
  onOpenChange,
  onSubmit,
  initialDish,
  daysInRange,
  menuDays,
}: DishFormProps) => {
  const [dishName, setDishName] = useState("");
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("12:00");
  const [dayOfWeek, setDayOfWeek] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialDish) {
      setDishName(initialDish.name);
      setGuests(initialDish.guests);
      setTime(initialDish.time);
      setDayOfWeek(initialDish.date);
    } else {
      setDishName("");
      setGuests(2);
      setTime("12:00");
      setDayOfWeek(undefined);
    }
  }, [initialDish, isOpen]);

  const getNextAvailableDay = () => {
    const usedDays = menuDays.map((day) => day.date);
    for (const day of daysInRange) {
      if (!usedDays.includes(day)) {
        return day;
      }
    }
    return daysInRange[menuDays.length % daysInRange.length];
  };

  const handleSubmit = () => {
    if (!dishName.trim()) {
      // Handle error
      return;
    }

    const newDish: MenuItem = {
      id: initialDish
        ? initialDish.id
        : Math.random().toString(36).substr(2, 9),
      name: dishName,
      guests,
      time,
      date: dayOfWeek || getNextAvailableDay(),
    };

    onSubmit(newDish);
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>
            {initialDish ? "Editar Platillo" : "Agregar Nuevo Platillo"}
          </SheetTitle>
          <SheetDescription>
            Ingresa los detalles del platillo para el menú
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dishName">Nombre del Platillo</Label>
            <Input
              id="dishName"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="Ej: Pasta al Pesto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guests">Número de Comensales</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Hora de Servicio</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Día de la Semana</Label>
            <Select
              value={dayOfWeek}
              onValueChange={(value) => setDayOfWeek(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un día" />
              </SelectTrigger>
              <SelectContent>
                {daysInRange.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter className="mt-6">
          <Button
            className="w-full bg-[#ff7900] hover:bg-[#e66d00]"
            onClick={handleSubmit}
          >
            {initialDish ? "Guardar Cambios" : "Agregar Platillo"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default DishForm;
