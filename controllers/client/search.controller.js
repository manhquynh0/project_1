const Tour = require("../../models/tour.model")
const moment = require("moment")
const slugify = require('slugify');
module.exports.list = async (req, res) => {
    const find = {
        deleted: false
    }
    // tìm theo điểm đi
    if (req.query.locationFrom) {
        find.locations = req.query.locationFrom
    }
    // tìm theo diểm đến
    if (req.query.locationTo) {
        const keyword = slugify(req.query.locationTo,
            {
                lower: true
            }
        )
        const keywordRegex = new RegExp(keyword)
        find.slug = keywordRegex
    }
    // tìm theo ngày khởi hành
    if (req.query.departureDate) {
        find.departureDate = new Date(req.query.departureDate);
    }
    const select = [
        "stockAdult",
        "stockChildren",
        "stockBaby",
    ]
    select.map(item => {
        if (req.query[item]) {
            find[item] = {
                $gte: parseInt(req.query[item])
            }
        }
    })
    if (req.params.price) {
        const [min, max] = req.params.price.split("-").map(item => parseInt(item))
        find.priceNewAdult = {
            $gte: min,
            $lte: max
        }
    }
    // phân trang
    const limitItems = 5;
    let page = 1;

    if (req.query.page) {
        const currentPage = parseInt(req.query.page);
        if (!isNaN(currentPage) && currentPage > 0) {
            page = currentPage;
        }
    }

    const totalRecord = await Tour.countDocuments(find);
    const totalPage = Math.max(Math.ceil(totalRecord / limitItems), 1); // nếu total page < 1 thì = 1 >  1 thì giữ nguyên
    if (page > totalPage) {
        page = totalPage;
    }

    const skip = (page - 1) * limitItems; // bỏ qua bao nhiêu record

    const pagination = {
        currentPage: page,
        totalPage: totalPage,
        skip: skip,
        totalRecord: totalRecord
    };

    // for (let item of tourList) {
    //     if (item.createdBy) {
    //         const infoAccountCreated = await AccountAdmin.findOne({
    //             _id: item.createdBy,
    //         })
    //         item.createdByFullName = infoAccountCreated ? infoAccountCreated.fullName : ""
    //     } else {
    //         item.createdByFullName = ""
    //     }

    const tourList = await Tour
        .find(find)
        .sort({
            position: "desc"
        })

    for (const item of tourList) {
        item.departureDateFormat = moment(item.departureDate).format("DD/MM/YYYY");
    }

    res.render("client/pages/search", {
        pageTitle: "Kết quả tìm kiếm",
        tourList: tourList,
        pagination: pagination
    });
}