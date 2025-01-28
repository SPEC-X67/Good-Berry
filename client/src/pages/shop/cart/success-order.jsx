import { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  CheckCircle,
  Download,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function OrderSuccess({ data }) {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const downloadInvoice = () => {
    const doc = new jsPDF();

    // Set initial coordinates
    const leftMargin = 15;
    const rightAlign = 190;
    const topMargin = 20;

    // Company name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Good Berry", leftMargin, topMargin);
    doc.setFontSize(9);
    doc.text("Private Limited", leftMargin, topMargin + 4);

    // Invoice header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Invoice", rightAlign - 50, topMargin);

    // Invoice details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Invoice#: ${data.orderId}`, rightAlign - 50, topMargin + 8);
    doc.text(
      `Date: ${new Date(data.createdAt).toLocaleDateString()}`,
      rightAlign - 50,
      topMargin + 13
    );

    // Bill To section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Shipping Address:", leftMargin, topMargin + 28);

    // Customer details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      [
        data.addressId.name,
        data.addressId.street,
        `${data.addressId.city}, ${data.addressId.state}, ${data.addressId.zip}`,
        data.addressId.mobile,
      ],
      leftMargin,
      topMargin + 34
    );

    // Items table
    const tableColumn = [
      { header: "ITEM DESCRIPTION", dataKey: "item" },
      { header: "PRICE", dataKey: "price" },
      { header: "QTY", dataKey: "qty" },
      { header: "TOTAL", dataKey: "total" },
    ];

    const tableRows = data.items.map((item) => ({
      item: item.name,
      price: `${item.price.toFixed(2)}`,
      qty: item.quantity,
      total: `${(item.price * item.quantity).toFixed(2)}`,
    }));

    doc.autoTable({
      startY: 80,
      head: [tableColumn.map((col) => col.header)],
      body: tableRows.map((row) => [row.item, row.price, row.qty, row.total]),
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
      },
      headStyles: {
        fillColor: false,
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineWidth: 0.0,
      },
      didDrawCell: (data) => {
        // Add bottom border to last row
        if (data.row.index === tableRows.length - 1) {
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
        }
      },
    });

    const finalY = doc.lastAutoTable.finalY || 120;

    doc.setFont("helvetica", "normal");
    doc.text("SUB TOTAL", rightAlign - 90, finalY + 15);
    doc.text(`${data.subtotal.toFixed(2)}`, rightAlign - 20, finalY + 15, {
      align: "right",
    });

    doc.text("Discount", rightAlign - 90, finalY + 22);
    doc.text(`-${data.discount.toFixed(2)}`, rightAlign - 20, finalY + 22, {
      align: "right",
    });

    doc.text("Coupon Discount", rightAlign - 90, finalY + 28);
    doc.text(
      `-${data.couponDiscount.toFixed(2)}`,
      rightAlign - 20,
      finalY + 28,
      { align: "right" }
    );

    // Grand total with bold font
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total", rightAlign - 90, finalY + 37);
    doc.text(`${data.total.toFixed(2)}`, rightAlign - 20, finalY + 37, {
      align: "right",
    });

    // Contact section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Contact", leftMargin, finalY + 65);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      [
        "Goodberry Inc. Anytown, USA, 123 Main Street",
        "help@goodberry.com",
        "www.goodberry.com",
      ],
      leftMargin,
      finalY + 72
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Thank you for choosing us!", leftMargin, finalY + 100);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "We appreciate your trust in us and hope you enjoy your purchase.",
      leftMargin,
      finalY + 106
    );
    doc.text(
      "If you have any questions, feel free to reach out to our support team.",
      leftMargin,
      finalY + 109
    );

    // Save the PDF
    doc.save(`invoice-${data.orderId}.pdf`);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-ping rounded-full bg-green-200 opacity-25" />
              <div className="relative">
                <CheckCircle className="w-20 h-20 mx-auto text-[#8CC63F]" />
              </div>
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Order Successfully Placed!
            </h1>
            <p className="mt-2 text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          <div className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-6 h-6 text-[#8CC63F]" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order Confirmed
                    </p>
                    <p className="text-sm text-gray-500">
                      Your order has been received
                    </p>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-[#8CC63F]" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Package className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Processing
                    </p>
                    <p className="text-sm text-gray-500">
                      We&apos;re preparing your order
                    </p>
                  </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Shipping
                    </p>
                    <p className="text-sm text-gray-500">
                      Your order will be shipped soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Button asChild className="w-full bg-[#8CC63F] hover:bg-[#8CC63F]">
              <Link to={`/account/order/${data.orderId}`}>
                Track Your Order
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={downloadInvoice}
            >
              <Download className="w-4 h-4" /> Download Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
