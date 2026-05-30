package com.example.demo.DTO;

public class ApiResponse {

    private String status;
    private int code;
    private String message;
    private Object data;

    // Private constructor — use static factory methods
    private ApiResponse(String status, int code, String message, Object data) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
    }

    // --- Static factory methods ---

    public static ApiResponse success(int code, String message, Object data) {
        return new ApiResponse("success", code, message, data);
    }

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse("success", 200, message, data);
    }

    public static ApiResponse error(int code, String message) {
        return new ApiResponse("error", code, message, null);
    }

    public static ApiResponse error(int code, String message, Object data) {
        return new ApiResponse("error", code, message, data);
    }

    // --- Getters ---

    public String getStatus() {
        return status;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public Object getData() {
        return data;
    }

    // --- Setters ---

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setData(Object data) {
        this.data = data;
    }
}
