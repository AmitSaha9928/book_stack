const path = require("path");
const booksModel = require("../../models/booksModel/booksModel");
const missingInputs = require("../../utils/missingInputs/missingInputs");

module.exports = {
  // Service to insert a new book
  async insertBookService(data) {
    console.log(data.body);
    try {
      const {
        bookTitle,
        bookSummary,
        bookPrice,
        amountOfPage,
        authorName,
        insertionUserId,
        categoryId,
      } = data.body;

      // Handle image upload (if any)
      let bookImg = null;
      if (data.file && data.file.path) {
        bookImg = path.basename(data.file.path);
      }

      // Check for required fields
      const requiredFields = {
        bookTitle,
        bookSummary,
        bookPrice,
        amountOfPage,
        authorName,
        insertionUserId,
        categoryId,
      };

      // If any required field is missing, return an error
      for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
        const missing = missingInputs(fieldValue, fieldName);
        if (missing) return missing;
      }

      // Check if the book title already exists
      const bookExists = await booksModel.findOne({ bookTitle });
      if (bookExists) {
        return {
          status: 409,
          error: false,
          message: "Book Title Already Exists",
          data: null,
        };
      }

      // Create the new book entry
      const newBook = await booksModel.create({
        bookTitle,
        bookPrice,
        bookSummary,
        amountOfPage,
        authorName,
        insertionUserId,
        categoryId,
        bookImg,
      });

      // Return success or failure message
      if (newBook) {
        return {
          status: 201,
          error: false,
          message: "Book created successfully",
          data: newBook,
        };
      } else {
        return {
          status: 400,
          error: true,
          message: "Failed to Create Books",
          data: null,
        };
      }
    } catch (error) {
      console.log(error, "Insert Book Service Failed");
      return {
        status: 500,
        error: true,
        message: "Insert Book Service Error",
      };
    }
  },

  // Service to get all active books
  async getAllBookService() {
    try {
      const books = await booksModel
        .find({ isActive: true, isDeleted: false })
        .populate("categoryId")
        .populate("insertionUserId");

      // If books are found, return them; otherwise, return a "not found" message
      if (books.length > 0) {
        return {
          status: 200,
          error: false,
          data: books,
          message: "List of all Books",
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No books found",
        };
      }
    } catch (error) {
      console.log(error, "Get All Books Service Failed");
      return {
        status: 500,
        error: true,
        message: "Get All Books Service Failed",
        data: null,
      };
    }
  },

  // Service to get a list of recent books (limit results)
  async getRecentBooksService(limit = 5) {
    try {
      const recentBooks = await booksModel
        .find({ isActive: true, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("categoryId")
        .populate("insertionUserId");

      // If recent books are found, return them; otherwise, return a "not found" message
      if (recentBooks.length > 0) {
        return {
          status: 200,
          error: false,
          data: recentBooks,
          message: "List of recent books",
        };
      } else {
        return {
          status: 404,
          error: true,
          message: "No recent books found",
        };
      }
    } catch (error) {
      console.log(error, "Get Recent Books Service Failed");
      return {
        status: 500,
        error: true,
        message: "Get Recent Books Service Failed",
        data: null,
      };
    }
  },

  // Service to get a single book by its ID
  async getSingleBookService(id) {
    try {
      const book = await booksModel.findOne({ _id: id, isActive: true })
        .populate("insertionUserId")
        .populate("categoryId");

      // If book is not found, return a "not found" message
      if (!book) {
        return {
          status: 404,
          error: false,
          message: "Book is Not Found under that Id",
          data: null,
        };
      }

      return {
        status: 200,
        error: false,
        message: "Book Found Successfully",
        data: book,
      };
    } catch (error) {
      console.log(error, "Get Single Book By Id Service Failed");
      return {
        status: 500,
        error: true,
        message: "Get Single Book By Id Service Failed",
        data: null,
      };
    }
  },

  // Service to get all books by a specific user ID
  async getBookByUserIdService(id) {
    console.log(id);
    try {
      const book = await booksModel.find({
        insertionUserId: id,
        isActive: true,
      });

      // If no books found for the user, return a "not found" message
      if (!book) {
        return {
          status: 404,
          error: false,
          message: "Book is Not Found under this user Id",
          data: null,
        };
      }

      return {
        status: 200,
        error: false,
        message: "Book Found Successfully",
        data: book,
      };
    } catch (error) {
      console.log(error, "Get Book By User Id Service Failed");
      return {
        status: 500,
        error: true,
        message: "Get Book By User Id Service Failed",
        data: null,
      };
    }
  },

  // Service to remove a book by its ID
  async removeBooksService(id) {
    try {
      const book = await booksModel.findOne({ _id: id });

      // If book is not found, return a "not found" message
      if (!book) {
        return {
          status: 404,
          error: false,
          message: "Book Not Found",
          data: null,
        };
      }

      // If the book is already removed, return a message indicating that
      if (book.isDeleted) {
        return {
          status: 409,
          error: false,
          message: "Book is already removed",
          data: null,
        };
      }

      // Mark the book as deleted
      book.isDeleted = true;
      book.isActive = false;
      await book.save();

      return {
        status: 200,
        error: false,
        message: "Book removed successfully",
      };
    } catch (error) {
      console.log(error, "Remove Books Service Failed");
      return {
        status: 500,
        error: true,
        message: "Remove Books Service Failed",
        data: null,
      };
    }
  },

  // Service to update book details
  async updateBookService(bookId, updateData) {
    try {
      const book = await booksModel.findById(bookId);

      // If book is not found or has been removed, return an error
      if (!book || book.isDeleted) {
        return {
          status: 404,
          error: true,
          message: "Book not found or has been removed",
        };
      }

      // Update book details
      Object.assign(book, updateData);
      await book.save();

      return {
        status: 200,
        error: false,
        message: "Book updated successfully",
      };
    } catch (error) {
      console.log(error, "Update Book Service Failed");
      return {
        status: 500,
        error: true,
        message: "Update Book Service Failed",
      };
    }
  },
};
