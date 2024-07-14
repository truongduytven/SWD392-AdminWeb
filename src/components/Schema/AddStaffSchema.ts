import { z } from "zod";

export const AddStaffSchema = z
	.object({
        userName: z
            .string()
            .min(2, 'Tên phải nhiều hơn 2 kí tự')
            .max(40, 'Tên ít hơn 40 kí tự'),
        companyID: z
            .string()
            .min(2, 'Tên phải nhiều hơn 2 kí tự')
            .max(40, 'Tên ít hơn 40 kí tự'),
        fullName: z
            .string()
            .min(2, 'Họ tên phải nhiều hơn 2 kí tự')
            .max(40, 'Họ tên ít hơn 40 kí tự'),
		address: z
            .string()
            .min(2, 'Địa chỉ phải nhiều hơn 2 kí tự')
            .max(40, 'Địa chỉ ít hơn 40 kí tự'),
        email: z
            .string()
            .min(1, 'Email là bắt buộc')
            .max(40, 'Email ít hơn 40 kí tự')
            .email('Email không hợp lệ'),
		phoneNumber: z.string()
		.refine(value => /^\d{10}$/.test(value) && value.startsWith('0'), {
			  message: 'Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số!',
			}),
		password: z.string().min(5, 'Mật khẩu phải dài ít nhất 5 kí tự'),
		confirmpassword: z.string(),
	})	
	.refine((data) => data.password === data.confirmpassword, {
		message: "Mật khẩu không khớp, vui lòng kiểm tra lại!",
		path: ['confirmpassword'], // path of error
	})