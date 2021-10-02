
export interface IErrorMessage {
    //code: string;
    display_vi: string;
}

export const getMessageByCode = (code: string): string => {
    let msg = errorMessages[code]
   
    if (msg == null || msg == undefined)
        return code
    return msg.display_vi || code
}

export const errorMessages: Record<string, Partial<IErrorMessage>> = {
    "job_tag_missing": { display_vi: "Phải có tối thiểu 3 tag" },
    "error": { display_vi: "Không thành công" },
    "invalid_data": { display_vi: "Dữ liệu không hợp lệ" },
    "not_found_data": { display_vi: "Không tìm thấy dữ liệu", },
    "email_existed": { display_vi: "Email này đã được đăng ký cho 1 tài khoản khác", },
    "error_login_expected": { display_vi: "Bạn phải đăng nhập", },
    "error_accept_policy": { display_vi: "Bạn phải đồng ý với các chính sách và điều khoản của chúng tôi", },
    "error_display_name_must_not_be_empty": { display_vi: "Tên không được để trống", },
    "error_email_must_not_be_empty": { display_vi: "Email không được để trống", },
    "error_invalid_email": { display_vi: "Email không hợp lệ", },
    "error_password_must_not_be_empty": { display_vi: "Mật khẩu không được để trống", },
    "error_password_not_match": { display_vi: "Mật khẩu không khớp", },
    "error_invalid_password": { display_vi: "Mật khẩu phải có tối thiểu 8 ký tự bao gồm số, chữ cái.", },
    "invalid_password": { display_vi: "Email hoặc mật khẩu không đúng", },
    "error_invalid_password_length": { display_vi: "Mật khẩu phải có ít nhất 8 ký tự", },
    "article_need_at_least_1_tags": { display_vi: "Bài viết phải có ít nhất 1 tag", },
    "article_max_3_tag": { display_vi: "Bài viết chỉ có thể có tối đa 3 tag", },
    "article_title_must_not_be_empty": { display_vi: "Tiêu đề bài viết không được để trống", },
    "article_content_must_not_be_empty": { display_vi: "Nội dung bài viết không được để trống", },
    "article_title_max_length_70": { display_vi: "Tiêu đề bài viết không được vượt quá 70 ký tự", },
    "password_not_match": { display_vi: "Mật khẩu không khớp", },
    "success": { display_vi: "Thành công", },
    "auto_save_success": { display_vi: "Đã lưu bài viết", },
    "sign_up_success": { display_vi: "Tạo tài khoản thành công", },
    
    "login_success": { display_vi: "Đăng nhập thành công", },
};

export enum messagesCode {
    success = "success",
    auto_save_success = "auto_save_success",
    error = "error",
    invalid_data = "invalid_data",
    article_need_min_1_tags = "article_need_min_1_tags",
    article_max_3_tag = "article_max_3_tag",
    article_title_must_not_be_empty = "article_title_must_not_be_empty",
    article_content_must_not_be_empty = "article_content_must_not_be_empty",
    article_title_max_length_70 = "article_title_max_length_70",
    password_not_match = "password_not_match",
    password_length_not_match = "password_length_not_match",
    job_need_min_1_tags = "job_need_min_1_tags",
    job_max_3_tag = "job_max_3_tag",
    job_title_must_not_be_empty = "job_title_must_not_be_empty",
    job_content_must_not_be_empty = "job_content_must_not_be_empty",
    job_title_max_length_70 = "job_title_max_length_70",
}
