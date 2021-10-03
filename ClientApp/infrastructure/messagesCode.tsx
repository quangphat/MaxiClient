
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
   
    "error": { display_vi: "Không thành công" },
    "invalid_data": { display_vi: "Dữ liệu không hợp lệ" },
    "not_found_data": { display_vi: "Không tìm thấy dữ liệu", },
   
    "success": { display_vi: "Thành công", },
    
};

export enum messagesCode {
    success = "success",
   
    error = "error",
    invalid_data = "invalid_data",
    
}
