import { Ingredient, MenuDay } from "@/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface MenuPDFProps {
  menuDays: MenuDay[];
  ingredients: Ingredient[];
}

const pdfStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 800,
    color: "#1f2937",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#ff9940",
    textAlign: "center",
    marginBottom: 12,
  },
  table: {
    display: "none",
    width: "100%",
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 6,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableHeader: {
    backgroundColor: "#fff1e6",
    textAlign: "center",
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: 800,
    color: "#4b5563",
  },
  tableCol: {
    width: "25%",
    padding: 8,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#e5e7eb",
  },
  tableColLast: {
    borderRightWidth: 0,
  },
  tableCell: {
    fontSize: 12,
    color: "#4b5563",
  },
  section: {
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  emptyIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  emptyMessage: {
    fontSize: 12,
    color: "#6b7280",
    fontStyle: "italic",
    textAlign: "center",
  },
  ingredientItem: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 4,
  },
});

const MenuPDF = ({ menuDays, ingredients }: MenuPDFProps) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <View style={pdfStyles.header}>
        <Image src="/images/logo.jpg" style={pdfStyles.logo} />
        <Text style={pdfStyles.title}>Planificador de Menú</Text>
      </View>
      <Text style={pdfStyles.subtitle}>Menú Semanal</Text>

      <View style={pdfStyles.section}>
        <View style={pdfStyles.table}>
          <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
            <Text style={[pdfStyles.tableCol, pdfStyles.tableHeaderText]}>
              Día
            </Text>
            <Text style={[pdfStyles.tableCol, pdfStyles.tableHeaderText]}>
              Platillo
            </Text>
            <Text style={[pdfStyles.tableCol, pdfStyles.tableHeaderText]}>
              Comensales
            </Text>
            <Text
              style={[
                pdfStyles.tableCol,
                pdfStyles.tableColLast,
                pdfStyles.tableHeaderText,
              ]}
            >
              Hora
            </Text>
          </View>
          {menuDays.length > 0 ? (
            menuDays.map((day, dayIndex) =>
              day.items.map((item, itemIndex, arr) => {
                const isLastRow =
                  dayIndex === menuDays.length - 1 &&
                  itemIndex === arr.length - 1;
                return (
                  <View
                    key={item.id}
                    style={[
                      pdfStyles.tableRow,
                      ...(isLastRow ? [pdfStyles.tableRowLast] : []),
                    ]}
                  >
                    <Text style={[pdfStyles.tableCol, pdfStyles.tableCell]}>
                      {day.date}
                    </Text>
                    <Text style={[pdfStyles.tableCol, pdfStyles.tableCell]}>
                      {item.name}
                    </Text>
                    <Text style={[pdfStyles.tableCol, pdfStyles.tableCell]}>
                      {item.guests} personas
                    </Text>
                    <Text
                      style={[
                        pdfStyles.tableCol,
                        pdfStyles.tableColLast,
                        pdfStyles.tableCell,
                      ]}
                    >
                      {item.time}
                    </Text>
                  </View>
                );
              })
            )
          ) : (
            <View
              style={[
                pdfStyles.tableRow,
                pdfStyles.tableRowLast,
                pdfStyles.emptyContainer,
              ]}
            >
              <Text style={pdfStyles.emptyMessage}>
                No hay platillos agregados
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.subtitle}>Lista de Compras</Text>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient) => (
            <Text key={ingredient.id} style={pdfStyles.ingredientItem}>
              - {ingredient.name}: {ingredient.quantity} {ingredient.unit} (
              {ingredient.dishName})
            </Text>
          ))
        ) : (
          <View style={pdfStyles.emptyContainer}>
            <Image src="/images/empty-icon.png" style={pdfStyles.emptyIcon} />
            <Text style={pdfStyles.emptyMessage}>
              No se han agregado ítems a la lista de compras
            </Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default MenuPDF;
