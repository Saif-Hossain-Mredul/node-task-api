const mongoose = require('mongoose');

const newUser = new mongoose.Schema({
	name: { type: string },
	phone,
	mail,
	profilePic,
	password,
	pinCode,
	collections: {
		boughtBooks,
		// new collection as user defines
	},
	uploadedBooks: [],
	boughtBooks: [],
	transactionHistory: [{...transactionSchema}],
	wishList: [],
	following: [],
	followers: [],
	credit,
	earnedRevenue,
	reactedBooks: [{ bookId }],
	listenedBooks: [{ bookId }],
	recentData: {},
    accountType: free || premium,
    lastSubscribed: date,
	searchedKeyWords = []
});

const bookSchema = new mongoose.Schema({
	name: { type: string },
	description,
	duration,
	uploader: {
		authorID,
		authorName,
	},
	bookCover: [],
    contentType: {
        chotoGolpo,
        golpoGucccha,
        abbrity,
        rommoGolpo,
        probondhoPath,
    },
	category: [],
	tag: [],
	price: Float,
    lastChangedPriceDate,
    discount: {
		percentage: true | false,
		amount,
	},
	id,
	review: [{...reviewSchema}],
	reviewLove: Int,
	releasedDate,
	boughtBy: [],
	listenedNumber: Int,
	listenedBy: [],
	report: [{}],
});

const reviewSchema = new mongoose.Schema({
	reviewDescription,
	id,
	bookId,
	userId,
	date,
});

const reportSchema = new mongoose.Schema({
	reportDescription,
	reportType: [],
	id,
	bookId,
	userId,
	date,
});

const transactionSchema = new mongoose.Schema({
	id,
	senderId,
	receiverId,
	bookId,
	bookPrice,
	discount: {
		percentage: true | false,
		amount,
        discountedBy : user | us,
	},
	authorsAmount: totalAmount * 0.7,
});

const withDrawSchema = new mongoose.Schema({
	id,
	userId,
	paymentType: [cashOut, cashIn],
	paymentInformation: {
		paidBy,
		amount,
		date,
		number,
		creditCardNumber,
	},
});
