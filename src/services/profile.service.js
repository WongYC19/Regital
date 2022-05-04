import api from "./api";
import {
  snakeToCamelObject,
  camelToSnakeObject,
} from "../utils/caseConversion";
import axios from "axios";

class ProfileService {
  getUserProfile = async () => {
    const response = await api.get(api.endpoints.userProfile);
    const userProfile = snakeToCamelObject(response.data) ?? {
      fullName: "Profile Service",
      profilePicture: "images/profile/",
    };
    return userProfile;
  };

  updateUserProfile = async (data) => {
    let { profilePicture, ...dataWithoutFileField } = data;
    const snakeData = camelToSnakeObject(dataWithoutFileField);
    const response = await api.put(api.endpoints.userProfile, snakeData);
    let camelData = response.data ?? {};
    camelData = { ...camelData, ...data };
    return camelData;
  };

  updateProfilePicture = async (event) => {
    const inputElem = event.target;
    const imageFile = inputElem.files[0];
    const formData = new FormData();
    formData.append("profile_picture", imageFile);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await api.patch(
      api.endpoints.userProfile,
      formData,
      config
    );

    const snakeData = snakeToCamelObject(response.data ?? {});
    return snakeData;
  };

  deleteProfilePicture = async (event) => {
    const response = await api.delete(api.endpoints.userProfile);
    const camelData = snakeToCamelObject(response.data ?? {});
    return camelData;
  };

  resetPassword = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach((item) => {
      const [key, value] = item;
      formData.append(key, value);
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = axios.post(
      api.defaults.baseURL + api.endpoints.resetPassword,
      formData,
      config
    );

    return response;
  };

  changePassword = async (data) => {
    const snakeData = camelToSnakeObject(data);
    const response = await api.put(api.endpoints.changePassword, snakeData);
    return response;
  };

  resetPasswordConfirm = async (data) => {
    const snakeData = camelToSnakeObject(data);
    const response = await axios.post(
      api.defaults.baseURL + api.endpoints.resetPasswordConfirm,
      snakeData
    );
    return response;
  };

  getUsers = async () => {
    const response = await api.get(api.endpoints.users);
    return response.data;
  };
}

export default new ProfileService();
