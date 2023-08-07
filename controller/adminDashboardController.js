const orderModel = require('../model/orderModel')
const userModel = require('../model/userModel')
const productModel = require('../model/productModel')
const moment = require('moment')
const excelJS = require("exceljs");

const view = async (req, res) => {
    try {

        let recentOrders = await orderModel.find()
            .sort({ _id: -1 })
            .populate({ path: "customer", select: "email" });
        const orderCount = recentOrders.length;
        const productCount = await productModel.count();
        const customerCount = await userModel.count();
        let totalRevenue;
        if (customerCount) {
            totalRevenue = await orderModel.aggregate([{
                $match: {
                    status: {
                        $nin: ["Cancelled", "Returned"]
                    }
                }

            },
            {
                $group: {
                    _id: 0,
                    totalRevenue: { $sum: "$finalPrice" }

                }
            }
            ])
            totalRevenue = totalRevenue[0].totalRevenue;
        } else {
            totalRevenue = 0;
        }

        res.render('admin/dashboard', {
            session: req.session.admin,
            recentOrders,
            moment,
            orderCount,
            customerCount,
            productCount,
            totalRevenue,
            documentTitle: 'Admin Dashboard | PETCOMMERCE'
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('/admin/login')
    }
}



const chartData = async (req, res) => {
    try {

        let currentYear = new Date();
        currentYear = currentYear.getFullYear();
        let orderData = await orderModel.aggregate([{
            $match: {
                status: {
                    $nin: ["Cancelled", "Returned"]
                }
            }

        },
        {
            $project: {
                _id: 0,
                totalProducts: "$totalQuantity",
                billAmount: "$finalPrice",
                week: {
                    $dayOfWeek: "$orderedOn"
                },
                month: {
                    $month: "$orderedOn"
                },
                year: {
                    $year: "$orderedOn"
                },

            }
        },
        {
            $group: {
                _id: { month: "$month", year: "$year" },
                totalProducts: { $sum: "$totalProducts" },
                totalOrders: { $sum: 1 },
                revenue: { $sum: "$billAmount" },
                avgBillPerOrder: { $avg: "$billAmount" }
            }
        },
        {
            $match: {
                "_id.year": currentYear
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
        ]);

        const delivered = await orderModel.find({ delivered: true }).count();
        const returned = await orderModel.find({ status: "Returned" }).count();
        let notDelivered = await orderModel.aggregate([
            { $match: { delivered: false } },
            {
                $group: {
                    _id: "$status",
                    status: { $sum: 1 }
                }
            }
        ]);
        let inTransit;
        let cancelled;
        notDelivered.forEach(order => {
            if (order._id === "In-transit") {
                inTransit = order.status
            } else if (order._id === "Cancelled") {
                cancelled = order.status
            }
        });
        res.json({
            data: { orderData, inTransit, cancelled, delivered, returned }
        })




    } catch (error) {
        console.log("error on getting chart data : " + error)
    }
}


const customChartData = async (req, res) => {
    try {
        const period = req.params.id
        console.log(period)
        if (period == "lastmonth") {
            let delivered = await orderModel.aggregate([{
                $match: { $and: [{ delivered: true }, { orderedOn: { $gte: new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)) } }] }
            }]);
            delivered = delivered.length;
            let returned = await orderModel.aggregate([{
                $match: { $and: [{ status: "Returned" }, { returnedOn: { $gte: new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)) } }] }
            }]);
            returned = returned.length;

            let notDelivered = await orderModel.aggregate([
                { $match: { $and: [{ delivered: false }, { orderedOn: { $gte: new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)) } }] } },
                {
                    $group: {
                        _id: "$status",
                        status: { $sum: 1 }
                    }
                }
            ]);
            let inTransit;
            let cancelled;
            notDelivered.forEach(order => {
                if (order._id === "In-transit") {
                    inTransit = order.status
                } else if (order._id === "Cancelled") {
                    cancelled = order.status
                }
            });
            res.json({
                data: { inTransit, cancelled, delivered, returned }
            })



        }
        else if (period == "lastweek") {

            let delivered = await orderModel.aggregate([{
                $match: { $and: [{ delivered: true }, { orderedOn: { $gte: new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)) } }] }
            }]);
            delivered = delivered.length;
            let returned = await orderModel.aggregate([{
                $match: { $and: [{ status: "Returned" }, { returnedOn: { $gte: new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)) } }] }
            }]);
            returned = returned.length;

            let notDelivered = await orderModel.aggregate([
                { $match: { $and: [{ delivered: false }, { orderedOn: { $gte: new Date(new Date().getTime() - (6 * 24 * 60 * 60 * 1000)) } }] } },
                {
                    $group: {
                        _id: "$status",
                        status: { $sum: 1 }
                    }
                }
            ]);
            let inTransit;
            let cancelled;
            notDelivered.forEach(order => {
                if (order._id === "In-transit") {
                    inTransit = order.status
                } else if (order._id === "Cancelled") {
                    cancelled = order.status
                }
            });
            res.json({
                data: { inTransit, cancelled, delivered, returned }
            })


        }
        else if (period == "last3month") {

            let delivered = await orderModel.aggregate([{
                $match: { $and: [{ delivered: true }, { orderedOn: { $gte: new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000)) } }] }
            }]);
            delivered = delivered.length;
            let returned = await orderModel.aggregate([{
                $match: { $and: [{ status: "Returned" }, { returnedOn: { $gte: new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000)) } }] }
            }]);
            returned = returned.length;

            let notDelivered = await orderModel.aggregate([
                { $match: { $and: [{ delivered: false }, { orderedOn: { $gte: new Date(new Date().getTime() - (90 * 24 * 60 * 60 * 1000)) } }] } },
                {
                    $group: {
                        _id: "$status",
                        status: { $sum: 1 }
                    }
                }
            ]);
            let inTransit;
            let cancelled;
            notDelivered.forEach(order => {
                if (order._id === "In-transit") {
                    inTransit = order.status
                } else if (order._id === "Cancelled") {
                    cancelled = order.status
                }
            });
            res.json({
                data: { inTransit, cancelled, delivered, returned }
            })


        }

    } catch (error) {
        console.log("error on getting custom chart data" + error)
    }
}


const downloadReport = async (req, res) => {
    try {
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Roport");
        worksheet.columns = [
          { header: "S No.", key: "s_no" },
          { header: "Order ID", key: "_id", width: 30 },
          { header: "Ordered On", key: "date", width: 20 },
          { header: "User", key: "user" , width: 20},
          { header: "Payment", key: "modeOfPayment" },
          { header: "Delivery", key: "orderStatus", width: 20 },
          { header: "Quantity", key: "item" },
          { header: "BIll Amount", key: "finalPrice", width: 15 },
          { header: "Revenue", key: "reportPrice" , width: 15},
        ];
        let counter = 1;
        let total = 0;
        let reportPrice = 0;
        let fromDate=new Date(req.body.fromdate);
        let toDate=new Date(req.body.todate)
        const saledata = await orderModel
          .find({orderedOn:{
            $lte: fromDate,
            $gte:toDate
          }})
          .populate({ path: "customer", select: "name" });
          console.log("to date",toDate);
          console.log("from date",fromDate);
        saledata.forEach((sale, i) => {
          const date = moment(sale.orderedOn);
          const orderID = sale._id.toString();
          const status = () => {
            if (sale.delivered === true) {
              return moment(sale.deliveredOn).format("lll");
            } else if (sale.delivered === false) {
              return sale.status;
            }
          };
          reportPrice += sale.finalPrice;
          sale.reportPrice = reportPrice;
          sale.date = date;
          sale._id = orderID;
          sale.s_no = counter;
          sale.orderStatus = status();
          sale.user = sale.customer.name;
          sale.item = sale.totalQuantity;
          worksheet.addRow(sale);
          counter++;
          total += sale.price;
        });
        worksheet.getRow(1).eachCell((cell) => {
          cell.font = { bold: true };
        });
    worksheet.getColumn(9).eachCell((cell)=> {
        cell.font = { color: { argb: '990000' },bold: true }
    
    })
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
        );
    
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=PETCOMMERCE-eCommerce_SalesReport.xlsx`
        );
    
        return workbook.xlsx.write(res).then(() => {
          res.status(200);
        });
      } catch (error) {
        console.log(error.message);
      }
}


module.exports = { view, chartData, customChartData,downloadReport } 