import { useState, useEffect } from "react"
import { subDays, subWeeks, subMonths, subYears, format, startOfDay, endOfDay } from "date-fns"
import { CalendarIcon, DollarSign, ShoppingCart, Tag, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useForm } from "react-hook-form"
import axios from "axios"
import jsPDF from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"

const SalesPeriod = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
  CUSTOM: "custom",
}

export default function SalesReportPage() {
  const [report, setReport] = useState(null)
  const [filteredOrders, setFilteredOrders] = useState([])
  const [filterText, setFilterText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)
  const form = useForm({
    defaultValues: {
      period: SalesPeriod.DAY,
      dateRange: {
        from: subDays(new Date(), 1),
        to: new Date(),
      },
    },
  })

  const { watch, setValue } = form

  const period = watch("period")
  const dateRange = watch("dateRange")

  useEffect(() => {
    fetchReport()
  }, [period, dateRange])

  useEffect(() => {
    if (report) {
      const filtered = report.orders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(filterText.toLowerCase()) ||
          order.userId.username.toLowerCase().includes(filterText.toLowerCase()),
      )
      setFilteredOrders(filtered)
      setCurrentPage(1)
    }
  }, [report, filterText])

  const fetchReport = async () => {
    const startDate = dateRange?.from ? formatDate(dateRange.from) : undefined
    const endDate = dateRange?.to ? formatDate(dateRange.to) : undefined
    const response = await axios.get('http://localhost:5000/api/admin/sales-report', {
      params: { period, startDate, endDate },
      withCredentials: true
    });
    setReport(response.data)
    setFilteredOrders(response.data.orders)
  }

  const handlePeriodChange = (newPeriod) => {
    setValue("period", newPeriod)
    const today = new Date()
    let newDateRange

    switch (newPeriod) {
      case SalesPeriod.DAY:
        newDateRange = { from: startOfDay(subDays(today, 1)), to: endOfDay(today) }
        break
      case SalesPeriod.WEEK:
        newDateRange = { from: startOfDay(subWeeks(today, 1)), to: endOfDay(today) }
        break
      case SalesPeriod.MONTH:
        newDateRange = { from: startOfDay(subMonths(today, 1)), to: endOfDay(today) }
        break
      case SalesPeriod.YEAR:
        newDateRange = { from: startOfDay(subYears(today, 1)), to: endOfDay(today) }
        break
      case SalesPeriod.CUSTOM:
        newDateRange = dateRange
        break
    }

    setValue("dateRange", newDateRange)
  }

  const handleDateRangeChange = (newDateRange) => {
    setValue("dateRange", newDateRange)
  }

  const handleFilterChange = (e) => {
    setFilterText(e.target.value)
  }

  const downloadReport = (format) => {
    if (format === "pdf") {
      downloadPDF()
    } else if (format === "excel") {
      downloadExcel()
    }
  }

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Draw border
      doc.setDrawColor(0);
      doc.setLineWidth(0.3);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Sales Report", pageWidth / 2, 35, { align: "center" });

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 40);
    
      doc.autoTable({
        startY: 50,
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        bodyStyles: { fontSize: 10, cellPadding: 3, textColor: 0 },
        head: [["Order ID", "Date", "Customer Name", "Order Amount", "Discount Amount", "Coupon Discount"]],
        body: filteredOrders.map(order => [
          order.orderId,
          formatDate(new Date(order.createdAt)),
          order.userId?.username || "N/A",
          order.total?.toFixed(2),
          order.discount?.toFixed(2),
          order.couponDiscount?.toFixed(2)
        ]),
      });
    
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        headStyles: { fillColor: [0, 0, 0], textColor: 255 },
        bodyStyles: { fontSize: 10, cellPadding: 3, textColor: 0 },
        head: [["Metric", "Value"]],
        body: [
          ["Overall Sales Count", report.overallSalesCount],
          ["Overall Order Count", report.overallOrderCount],
          ["Overall Order Amount", report.overallOrderAmount.toFixed(2)],
          ["Overall Discount", report.overallDiscount.toFixed(2)],
          ["Overall Coupon Discount", report.overallCouponDiscount.toFixed(2)],
        ],
      });

      doc.save("sales_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const downloadExcel = () => {
    const worksheetData = filteredOrders.map(order => ({
      "Order ID": order.orderId,
      "Date": formatDate(new Date(order.createdAt)),
      "Customer Name": order.userId?.username,
      "Order Amount": order.total?.toFixed(2),
      "Discount Amount": order.discount?.toFixed(2),
      "Coupon Discount": `${order.couponDiscount?.toFixed(2) || "0.00"}`
    }))
    worksheetData.push({})
    worksheetData.push({
      "Order ID": "Overall Sales Count",
      "Date": report.overallSalesCount,
      "Customer Name": "Overall Order Count",
      "Order Amount": report.overallOrderCount,
      "Discount Amount": "Overall Order Amount",
      "Coupon Discount": `₹${report.overallOrderAmount.toFixed(2)}`
    })
    worksheetData.push({
      "Order ID": "Overall Discount",
      "Date": `₹${report.overallDiscount.toFixed(2)}`,
      "Customer Name": "Overall Coupon Discount",
      "Order Amount": `₹${report.overallCouponDiscount.toFixed(2)}`
    })
    const worksheet = XLSX.utils.json_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report")
    XLSX.writeFile(workbook, "sales_report.xlsx")
  }

  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd")
  }

  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Sales Report</h1>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Period</FormLabel>
                <Select onValueChange={handlePeriodChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a report period" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={SalesPeriod.DAY}>Day</SelectItem>
                    <SelectItem value={SalesPeriod.WEEK}>Week</SelectItem>
                    <SelectItem value={SalesPeriod.MONTH}>Month</SelectItem>
                    <SelectItem value={SalesPeriod.YEAR}>Year</SelectItem>
                    <SelectItem value={SalesPeriod.CUSTOM}>Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Select the period for your sales report</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {period === SalesPeriod.CUSTOM && (
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Range</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-[300px] justify-start text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {formatDate(field.value.from)} - {formatDate(field.value.to)}
                              </>
                            ) : (
                              formatDate(field.value.from)
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value?.from}
                        selected={field.value}
                        onSelect={handleDateRangeChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select the custom date range for your report</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>

      {report && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <Card className="bg-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">₹{report.overallOrderAmount.toFixed(2)}</div>
                <p className="text-xs text-green-600">{report.overallSalesCount} items sold</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{filteredOrders.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-800">Total Discounts</CardTitle>
                <Tag className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-700">₹{report.overallDiscount.toFixed(2)}</div>
              </CardContent>
            </Card>
            <Card className="bg-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Coupon Discounts</CardTitle>
                <Percent className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700">₹{report.overallCouponDiscount.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-blue-600">Detailed Sales Report</CardTitle>
              <CardDescription>
                {formatDate(report.startDate)} to {formatDate(report.endDate)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Filter by Order ID or Customer Name"
                  value={filterText}
                  onChange={handleFilterChange}
                  className="max-w-sm"
                />
              </div>
              <Table>
                <TableCaption>Sales report for the selected period</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-blue-600">Order ID</TableHead>
                    <TableHead className="text-blue-600">Date</TableHead>
                    <TableHead className="text-blue-600">Customer Name</TableHead>
                    <TableHead className="text-blue-600">Order Amount</TableHead>
                    <TableHead className="text-blue-600">Discount Amount</TableHead>
                    <TableHead className="text-blue-600">Coupon Discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow key={order.orderId}>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{formatDate(new Date(order.createdAt))}</TableCell>
                      <TableCell>{order.userId?.username}</TableCell>
                      <TableCell>₹{order.total?.toFixed(2)}</TableCell>
                      <TableCell>₹{order.discount?.toFixed(2)}</TableCell>
                      <TableCell>₹{order.couponDiscount?.toFixed(2) ||"0.00"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                    </PaginationItem>
                    {currentPage > 2 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => paginate(1)}>1</PaginationLink>
                      </PaginationItem>
                    )}
                    {currentPage > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1
                      if (
                        pageNumber === currentPage ||
                        pageNumber === currentPage - 1 ||
                        pageNumber === currentPage + 1
                      ) {
                        return (
                          <PaginationItem key={index}>
                            <PaginationLink onClick={() => paginate(pageNumber)} isActive={currentPage === pageNumber}>
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }
                      return null
                    })}
                    {currentPage < totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    {currentPage < totalPages - 1 && (
                      <PaginationItem>
                        <PaginationLink onClick={() => paginate(totalPages)}>{totalPages}</PaginationLink>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={() => downloadReport("pdf")} className="mr-2 bg-blue-500 hover:bg-blue-600">
                Download PDF
              </Button>
              <Button onClick={() => downloadReport("excel")} className="bg-green-500 hover:bg-green-600">
                Download Excel
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

