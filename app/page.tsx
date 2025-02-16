"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChefHat,
  Calendar as CalendarIcon,
  Plus,
  ShoppingCart,
  ClipboardList,
  Trash2,
  FileDown,
  Clock,
  Users,
  Utensils,
  History,
  Save
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { es } from 'date-fns/locale';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface MenuItem {
  id: string;
  name: string;
  guests: number;
  time: string;
}

interface MenuDay {
  date: Date;
  items: MenuItem[];
}

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  dishName: string;
}

interface SavedMenu {
  id: string;
  name: string;
  days: MenuDay[];
  ingredients: Ingredient[];
}

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  item: {
    marginBottom: 5,
  },
});

const MenuPDF = ({ menuDays, ingredients }: { menuDays: MenuDay[], ingredients: Ingredient[] }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.title}>Menú Semanal</Text>
      
      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Platillos</Text>
        {menuDays.map((day) => (
          <View key={day.date.toISOString()} style={pdfStyles.item}>
            <Text>{day.date.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</Text>
            {day.items.map((item) => (
              <Text key={item.id}>
                - {item.name} ({item.guests} personas) - {item.time}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Lista de Compras</Text>
        {ingredients.map((ingredient) => (
          <Text key={ingredient.id} style={pdfStyles.item}>
            - {ingredient.name}: {ingredient.quantity} {ingredient.unit} ({ingredient.dishName})
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default function Home() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 6)),
  });
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false);
  const [menuDays, setMenuDays] = useState<MenuDay[]>([]);
  const [currentDishName, setCurrentDishName] = useState("");
  const [currentGuests, setCurrentGuests] = useState(2);
  const [currentTime, setCurrentTime] = useState("12:00");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [savedMenus, setSavedMenus] = useState<SavedMenu[]>([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    quantity: 1,
    unit: "kg",
    dishName: "",
  });
  const { toast } = useToast();

  const handleCreateMenu = () => {
    if (!date?.from || !date?.to) {
      toast({
        title: "Selecciona un rango de fechas",
        description: "Debes seleccionar las fechas para crear el menú",
        variant: "destructive",
      });
      return;
    }
    setIsCreateMenuOpen(true);
  };

  const handleAddDish = () => {
    if (!currentDishName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa el nombre del platillo",
        variant: "destructive",
      });
      return;
    }

    const newDish: MenuItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: currentDishName,
      guests: currentGuests,
      time: currentTime,
    };

    const today = new Date();
    const existingDay = menuDays.find(
      day => day.date.toDateString() === today.toDateString()
    );

    if (existingDay) {
      setMenuDays(menuDays.map(day => 
        day.date.toDateString() === today.toDateString()
          ? { ...day, items: [...day.items, newDish] }
          : day
      ));
    } else {
      setMenuDays([...menuDays, { date: today, items: [newDish] }]);
    }

    setCurrentDishName("");
    toast({
      title: "Platillo agregado",
      description: "El platillo se ha agregado al menú correctamente",
    });
  };

  const handleAddIngredient = () => {
    if (!newIngredient.name.trim() || !newIngredient.dishName.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos del ingrediente",
        variant: "destructive",
      });
      return;
    }

    const ingredient: Ingredient = {
      id: Math.random().toString(36).substr(2, 9),
      ...newIngredient
    };

    setIngredients([...ingredients, ingredient]);
    setNewIngredient({
      name: "",
      quantity: 1,
      unit: "kg",
      dishName: "",
    });

    toast({
      title: "Ingrediente agregado",
      description: "El ingrediente se ha agregado a la lista de compras",
    });
  };

  const handleRemoveDish = (dayIndex: number, dishId: string) => {
    setMenuDays(menuDays.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          items: day.items.filter(item => item.id !== dishId)
        };
      }
      return day;
    }));
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== ingredientId));
  };

  const handleSaveMenu = () => {
    if (menuDays.length === 0) {
      toast({
        title: "Menú vacío",
        description: "Agrega platillos antes de guardar el menú",
        variant: "destructive",
      });
      return;
    }

    const newSavedMenu: SavedMenu = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Menú ${savedMenus.length + 1}`,
      days: menuDays,
      ingredients: ingredients,
    };

    setSavedMenus([...savedMenus, newSavedMenu]);
    toast({
      title: "Menú guardado",
      description: "El menú se ha guardado correctamente",
    });
  };

  const handleLoadMenu = (savedMenu: SavedMenu) => {
    setMenuDays(savedMenu.days);
    setIngredients(savedMenu.ingredients);
    toast({
      title: "Menú cargado",
      description: "El menú se ha cargado correctamente",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-[#1f2937] text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-[#ff7900]" />
            <h1 className="text-2xl font-bold">Planificador de Menú</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:text-[#ff7900]"
              onClick={handleSaveMenu}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar Menú
            </Button>
            {menuDays.length > 0 && (
              <PDFDownloadLink
                document={<MenuPDF menuDays={menuDays} ingredients={ingredients} />}
                fileName="menu-semanal.pdf"
              >
                {({ loading }) => (
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-[#ff7900]"
                    disabled={loading}
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    {loading ? "Generando PDF..." : "Exportar PDF"}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Menú Actual</TabsTrigger>
            <TabsTrigger value="saved">Menús Guardados</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Seleccionar Fechas del Menú
                  </h2>
                  <Button 
                    onClick={handleCreateMenu}
                    className="bg-[#ff7900] hover:bg-[#e66d00]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Platillo
                  </Button>
                </div>
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={setDate}
                  locale={es}
                  className="rounded-md border"
                />
              </Card>

              <Card className="p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Menú Actual
                </h2>
                <ScrollArea className="h-[400px] pr-4">
                  {menuDays.length === 0 ? (
                    <div className="text-center py-8">
                      <Utensils className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">No hay platillos en el menú</p>
                    </div>
                  ) : (
                    menuDays.map((day, dayIndex) => (
                      <div key={day.date.toISOString()} className="mb-6">
                        <h3 className="font-medium text-gray-700 mb-2">
                          {day.date.toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h3>
                        {day.items.map((item) => (
                          <div key={item.id} className="bg-white p-4 rounded-lg shadow mb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Users className="h-4 w-4 mr-1" />
                                  <span className="mr-3">{item.guests} personas</span>
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{item.time}</span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveDish(dayIndex, item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="saved">
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Menús Guardados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedMenus.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <History className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No hay menús guardados</p>
                  </div>
                ) : (
                  savedMenus.map((menu) => (
                    <Card key={menu.id} className="p-4">
                      <h3 className="font-medium mb-2">{menu.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        {menu.days.length} días, {menu.ingredients.length} ingredientes
                      </p>
                      <Button
                        onClick={() => handleLoadMenu(menu)}
                        className="w-full bg-[#ff7900] hover:bg-[#e66d00]"
                      >
                        Cargar Menú
                      </Button>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={isCreateMenuOpen} onOpenChange={setIsCreateMenuOpen}>
        <SheetContent side="right" className="w-full sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Agregar Nuevo Platillo</SheetTitle>
            <SheetDescription>
              Ingresa los detalles del platillo para el menú
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dishName">Nombre del Platillo</Label>
              <Input
                id="dishName"
                value={currentDishName}
                onChange={(e) => setCurrentDishName(e.target.value)}
                placeholder="Ej: Pasta al Pesto"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Número de Comensales</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                value={currentGuests}
                onChange={(e) => setCurrentGuests(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora de Servicio</Label>
              <Input
                id="time"
                type="time"
                value={currentTime}
                onChange={(e) => setCurrentTime(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button
              className="w-full bg-[#ff7900] hover:bg-[#e66d00]"
              onClick={handleAddDish}
            >
              Agregar Platillo
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isShoppingListOpen} onOpenChange={setIsShoppingListOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            className="fixed bottom-6 right-6 shadow-lg bg-white"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Lista de Compras
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Lista de Compras</SheetTitle>
            <SheetDescription>
              Ingredientes necesarios para el menú
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Agregar Nuevo Ingrediente</Label>
                <Input
                  placeholder="Nombre del ingrediente"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({...newIngredient, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({...newIngredient, quantity: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidad</Label>
                  <Select
                    value={newIngredient.unit}
                    onValueChange={(value) => setNewIngredient({...newIngredient, unit: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogramos</SelectItem>
                      <SelectItem value="g">Gramos</SelectItem>
                      <SelectItem value="l">Litros</SelectItem>
                      <SelectItem value="ml">Mililitros</SelectItem>
                      <SelectItem value="unidad">Unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Platillo</Label>
                <Select
                  value={newIngredient.dishName}
                  onValueChange={(value) => setNewIngredient({...newIngredient, dishName: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un platillo" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuDays.flatMap(day => 
                      day.items.map(item => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full bg-[#ff7900] hover:bg-[#e66d00]"
                onClick={handleAddIngredient}
              >
                Agregar Ingrediente
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Ingredientes Agregados</h3>
              <ScrollArea className="h-[300px]">
                {ingredients.length === 0 ? (
                  <Badge variant="secondary" className="mb-4">
                    No hay ingredientes en la lista
                  </Badge>
                ) : (
                  ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2">
                      <div>
                        <p className="font-medium">{ingredient.name}</p>
                        <p className="text-sm text-gray-500">
                          {ingredient.quantity} {ingredient.unit} - {ingredient.dishName}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveIngredient(ingredient.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <Toaster />
    </main>
  );
}