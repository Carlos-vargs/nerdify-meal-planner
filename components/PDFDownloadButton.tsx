import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import MenuPDF from "@/components/MenuPDF";
import { MenuItem, MenuDay, Ingredient } from "@/types"; // Add this if you have types defined

interface PDFDownloadButtonProps {
  menuDays: MenuDay[];
  ingredients: Ingredient[];
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  menuDays,
  ingredients,
}) => {
  return (
    <PDFDownloadLink
      document={<MenuPDF menuDays={menuDays} ingredients={ingredients} />}
      fileName="menu-semanal.pdf"
    >
      {/* @ts-ignore */}
      {({ loading }) => (
        <Button
          variant="ghost"
          className="text-white border-2 hover:text-[#ff7900]"
          disabled={loading}
        >
          <FileDown className="mr-2 h-4 w-4" />
          {loading ? "Generando PDF..." : "Exportar PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFDownloadButton;
