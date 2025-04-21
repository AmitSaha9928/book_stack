const categoryModel = require("../../models/categoryModel/categoryModel");
const missingInputs = require("../../utils/missingInputs/missingInputs");

module.exports = {
  // Service to create a new category
  async createCategoryService(data) {
    try {
      const { categoryName, categoryCode } = data.body;

      // Required fields for creating a category
      const requiredFields = { categoryName, categoryCode };
      
      // Check if any required field is missing
      for (const [fieldName, fieldValue] of Object.entries(requiredFields)) {
        const missing = missingInputs(fieldValue, fieldName);
        if (missing) return missing; // Return missing field error if any
      }

      // Check if the category with the same name or code already exists
      const existingCategory = await categoryModel.findOne({
        $or: [{ categoryName }, { categoryCode }],
        isDeleted: false,
      });

      if (existingCategory) {
        // Return conflict error if category exists
        return {
          status: 409,
          error: false,
          message: "Category Name or Code Already Exists",
          data: null,
        };
      }

      // Create a new category if no conflict
      const newCategory = await categoryModel.create({
        categoryName,
        categoryCode,
      });

      if (newCategory) {
        // Return success message if category is created successfully
        return {
          status: 201,
          error: false,
          message: "Category created successfully",
          data: newCategory,
        };
      } else {
        // Return failure message if category creation fails
        return {
          status: 400,
          error: true,
          message: "Failed to Create the Category",
          data: null,
        };
      }
    } catch (error) {
      console.log(error, "Create Category Failed");
      // Return generic error if something goes wrong
      return {
        status: 500,
        error: true,
        message: "Create Category Failed",
      };
    }
  },

  // Service to get all categories
  async getAllCategoryService() {
    try {
      // Fetch all categories that are not deleted
      const categories = await categoryModel.find({ isDeleted: false });

      if (categories.length > 0) {
        // Return the categories if found
        return {
          status: 200,
          error: false,
          message: "Categories retrieved successfully",
          data: categories,
        };
      } else {
        // Return error if no categories found
        return {
          status: 400,
          error: true,
          message: "No Category found",
          data: null,
        };
      }
    } catch (error) {
      console.log(error, "Get All Categories Failed");
      // Return generic error if something goes wrong
      return {
        status: 500,
        error: true,
        message: "Get All Categories Failed",
      };
    }
  },

  // Service to get category by ID
  async getCategoryByIdService(id) {
    try {
      // Find category by ID and check if it's not deleted
      const category = await categoryModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!category) {
        // Return error if category not found
        return {
          status: 404,
          error: true,
          message: "Category not found",
          data: null,
        };
      }
      // Return the category if found
      return {
        status: 200,
        error: false,
        message: "Category retrieved successfully",
        data: category,
      };
    } catch (error) {
      console.log(error, "Get Category by ID Failed");
      // Return generic error if something goes wrong
      return {
        status: 500,
        error: true,
        message: "Get Category by ID Failed",
      };
    }
  },

  // Service to remove category by ID
  async removeCategoryService(id) {
    try {
      // Find category by ID and check if it's not deleted
      const category = await categoryModel.findOne({
        _id: id,
        isDeleted: false,
      });

      if (!category) {
        // Return error if category not found or already deleted
        return {
          status: 404,
          error: true,
          message: "Category not found or already deleted",
          data: null,
        };
      }

      // Mark the category as deleted
      const rmvCategory = await categoryModel.findByIdAndUpdate(
        { _id: id },
        { isActive: false, status: false, isDeleted: true },
        { new: true }
      );

      if (rmvCategory) {
        // Return success message if category is removed
        return {
          status: 200,
          error: false,
          message: "Category removed successfully",
          data: null,
        };
      } else {
        // Return failure message if removal fails
        return {
          status: 400,
          error: true,
          message: "Failed to remove Category",
          data: null,
        };
      }
    } catch (error) {
      console.log(error, "Remove Category Failed");
      // Return generic error if something goes wrong
      return {
        status: 500,
        error: true,
        message: "Remove Category Failed",
      };
    }
  },

  // Service to update category by ID
  async updateCategoryService(categoryId, data) {
    try {
      const { categoryName, categoryCode } = data.body;

      // Ensure at least one field is provided for updating
      if (!categoryName && !categoryCode) {
        return {
          status: 400,
          error: true,
          message:
            "At least one field (categoryName or categoryCode) must be provided",
          data: null,
        };
      }

      // Find category to update by ID
      const category = await categoryModel.findOne({
        _id: categoryId,
        isDeleted: false,
      });

      if (!category) {
        // Return error if category not found
        return {
          status: 404,
          error: true,
          message: "Category not found",
          data: null,
        };
      }

      // Check for duplicates in category name or code
      const duplicate = await categoryModel.findOne({
        $or: [{ categoryName }, { categoryCode }],
        _id: { $ne: categoryId },
        isDeleted: false,
      });

      if (duplicate) {
        // Return error if duplicate category exists
        return {
          status: 409,
          error: true,
          message: "Category Name or Code already exists",
          data: null,
        };
      }

      // Update the category with new values
      const updatedCategory = await categoryModel.findByIdAndUpdate(
        categoryId,
        {
          ...(categoryName && { categoryName }),
          ...(categoryCode && { categoryCode }),
        },
        { new: true }
      );

      // Return the updated category data
      return {
        status: 200,
        error: false,
        message: "Category updated successfully",
        data: updatedCategory,
      };
    } catch (error) {
      console.log(error, "Update Category Failed");
      // Return generic error if something goes wrong
      return {
        status: 500,
        error: true,
        message: "Update Category Failed",
      };
    }
  },
};
