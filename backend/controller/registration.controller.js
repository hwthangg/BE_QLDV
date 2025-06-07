import Registration from '../model/registration.model.js';
import { sendResponse } from '../utils/response.js';

const RegistrationController = () => {
  const createRegistration = async (req, res) => {
    try {
      const { eventId } = req.body
      const accountId = req.userId
      const registration = new Registration({ eventId: eventId, accountId: accountId })
      await registration.save()

      return sendResponse(res, 201, 'Đăng ký sự kiện thành công');
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  const checkIn = async (req, res) => {
    try {
      const { id } = req.params
      const registration = await Registration.findById(id)
      registration.status = 'attended'

      await registration.save()
      return sendResponse(res, 200, 'Điểm danh sự kiện thành công');
    } catch (error) {
      console.log(error?.message);
      return sendResponse(res, 500, error.message);
    }
  };

  return {
    createRegistration,
    checkIn,
  };
};

export default RegistrationController();
