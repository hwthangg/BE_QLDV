


export const checkDuplicated = async (model, field, value) => {
  const result = { isDuplicated: false, message: '' };
  try {
    const duplicatedDocument = await model.findOne({ [field]: value })
    if (duplicatedDocument) {
      result.isDuplicated = true;
      result.message = `${field} đã tồn tại`
    }
    return result
  } catch (error) {
    console.log(error?.message)
    result.message = 'Có lỗi khi kiểm tra'
    return result
  }
}

export const validateAccountForm = (form, updating = false) => {
  const result = { isValid: true, message: '' };

  const generalFields = ['email', 'phone', 'fullname', 'gender', 'birthday', 'role']; // không xử lý avatar
  const managerFields = ['chapterId'];
  const memberFields = ['chapterId', 'cardCode', 'joinedAt', 'position', 'hometown', 'ethnicity', 'religion', 'eduLevel'];

  try {
    const role = form.role;

    // Kiểm tra các trường bắt buộc nếu không phải cập nhật
    if (!updating) {
      for (const field of generalFields) {
        if (!form[field] && form[field] !== 0) {
          result.isValid = false;
          result.message = `${field} không được để trống`;
          return result;
        }
      }

      if (role === 'member') {
        for (const field of memberFields) {
          if (!form[field] && form[field] !== 0) {
            result.isValid = false;
            result.message = `${field} không được để trống`;
            return result;
          }
        }
      } else if (role === 'manager') {
        for (const field of managerFields) {
          if (!form[field] && form[field] !== 0) {
            result.isValid = false;
            result.message = `${field} không được để trống`;
            return result;
          }
        }
      }
    } else {
      // Cập nhật: kiểm tra trường nhập nếu có thì không được để trống
      for (const field in form) {
        if (!form[field] && form[field] !== 0) {
          result.isValid = false;
          result.message = `${field} không được để trống`;
          return result;
        }
      }
    }

    // Thêm xử lý các trường cụ thể

    return result;

  } catch (error) {
    console.log(error.message);
    result.isValid = false;
    result.message = 'Lỗi kiểm tra đầu vào biểu mẫu tài khoản';
    return result;
  }
};

export const validateChapterForm = (form, updating = false) => {
  const result = { isValid: true, message: '' };

  const fields = ['name', 'affiliated', 'address', 'establishedAt']; // không xử lý avatar


  try {

    // Kiểm tra các trường bắt buộc nếu không phải cập nhật
    if (!updating) {
      for (const field of fields) {
        if (!form[field] && form[field] !== 0) {
          result.isValid = false;
          result.message = `${field} không được để trống`;
          return result;
        }
      }

    } else {
      // Cập nhật: kiểm tra trường nhập nếu có thì không được để trống
      for (const field in form) {
        if (!form[field] && form[field] !== 0) {
          result.isValid = false;
          result.message = `${field} không được để trống`;
          return result;
        }
      }
    }

    // Thêm xử lý các trường cụ thể

    return result;

  } catch (error) {
    console.log(error.message);
    result.isValid = false;
    result.message = 'Lỗi kiểm tra đầu vào biểu mẫu chi đoàn';
    return result;
  }
};

export const validateDocumentForm = (form, updating = false) => {
  const result = { isValid: true, message: '' };

  const fields = ['docCode', 'name', 'description', 'issuer', 'issuedAt', 'chapterId', 'scope']; // không xử lý file


  try {

    // Kiểm tra các trường bắt buộc nếu không phải cập nhật
    if (!updating) {
      for (const field of fields) {
        if (!form[field] && form[field] !== 0) {
          result.isValid = false;
          result.message = `${field} không được để trống`;
          return result;
        }
      }

    } else {
      // Cập nhật: kiểm tra trường nhập nếu có thì không được để trống
      for (const field in form) {
        if (!form[field] && form[field] !== 0) {
          result.isValid = false;
          result.message = `${field} không được để trống`;
          return result;
        }
      }
    }

    // Thêm xử lý các trường cụ thể

    return result;

  } catch (error) {
    console.log(error.message);
    result.isValid = false;
    result.message = 'Lỗi kiểm tra đầu vào biểu mẫu chi đoàn';
    return result;
  }
};


export const validateEventForm = (form, updating = false) => {
  const result = { isValid: true, message: '' };

  const fields = ['name', 'startedAt', 'location', 'description', 'scope']; // không xử lý file


  try {

    // Kiểm tra các trường bắt buộc nếu không phải cập nhật
    if (!updating) {
      for (const field of fields) {
        if (!form[field] && form[field] !== 0) {
          result.isValid = false;
          result.message = `${field} không được để trống`;
          return result;
        }
      }

    } else {
      // Cập nhật: kiểm tra trường nhập nếu có thì không được để trống
      for (const field in form) {
        if (!form[field] && form[field] !== 0) {
          result.isValid = false;
          result.message = `${field} không được để trống`;
          return result;
        }
      }
    }

    // Thêm xử lý các trường cụ thể

    return result;

  } catch (error) {
    console.log(error.message);
    result.isValid = false;
    result.message = 'Lỗi kiểm tra đầu vào biểu mẫu chi đoàn';
    return result;
  }
};