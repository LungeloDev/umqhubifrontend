import {del, get, post, put} from "./api_helper"


export const getLandingPageData = data => get('/page', data)
// landing page platform section api
export const fetchServiceHeading = (data) => get("/service/category/heading", data);
export const fetchServiceInfo = (data) => get("/service/category/info", data);

// contact-us info
export const postContactUs = data => post('/frontend/landing-page/contactUsInfo', data);

//blog
export const fetchBlogs = data => get('/blog/list', data)
export const fetchBlog = data => get('/blog', data)
export const postBlog = data => post('/blog', data)
export const delBlog = data => del('/blog', data)

// user
export const updateUserByAdmin = data => post("/user/update-by-admin", data)
export const getUserDetailsById = data => get("/user/details", data)

// user feedback
export const fetchUserFeedbackSite = data => get('/user-feedback/site', data)
export const fetchUserFeedback = data => get('/user-feedback/list', data)
export const delUserFeedback = (data) => del("/user-feedback", data);
export const updateUserFeedback = (data) => post("/user-feedback/update", data);

export const postSendOtp = data => post('/user/send-otp', data)
export const postOtpVerify = data => post('/user/otp-verify', data)
export const postResendOtp = data => post('/user/resend-otp', data)
export const postResendOtpVerify = data => post('/user/resend-otp-verify', data)
export const getVerifiedUser = data => post('/user/verify', data)
export const postUserProfileByToken = data => post('/user/update-by-token', data)
export const postUserProfileByAdmin = data => post('/user/update-by-admin', data)
export const postPasswordResetOTPVerify = data => post('/user/password-reset-otp-verify', data)
export const postPasswordReset = data => post("/user/password-reset", data)
export const postOtpPasswordReset = data => post("/user/otp-password-reset", data)

//OTP related(forgot password)
export const getOTPForgotPass = data => post('/user/send-reset-otp', data)
export const verifyOTPForgotPass = data => post('/user/verify-reset-otp', data)
export const resetPass = data => post('/user/reset-password', data)

export const postLogin = data => post('/user/web-login', data)
export const postSocialLogin = data => post('/user/social-login-web', data)
export const postSignup = data => post('/user/registration', data)
export const fetchProfile = data => get('/user/verify', data)
export const verifyByEmailPhone = data => get('/user/verify-by-email-phone', data)
export const getProfile = data => get('/user/profile', data)
export const userProfilePasswordChangeAPI = data => post('/user/password-update', data)
export const userProfilePasswordChangeAdmin = data => post('/user/password-update-by-admin', data)
export const deleteUserAdmin = data => del('/user', data)

export const fetchSiteSettings = data => get('/settings/site', data)
export const fetchPaymentsSettings = data => get('/settings/payment', data)
export const fetchEarnWithShare = data => get('/frontend/earn-with-share-page', data)
export const fetchSettings = data => get('/settings', data)
export const postSettings = data => post('/settings', data)

export const getLanguageSettings = data => get('/settings/languages', data)

//ticket
export const postTicket = data => post('/ticket/', data)
export const featchTickets = data => get('/ticket/', data)
export const featchTicketsByUser = data => get('/ticket/by-user', data)

// deposit Money
export const stripeDeposit = data => post("/wallet/stripe", data)
export const paypalDeposit = data => post("/wallet/paypal", data)
export const flutterwaveDeposit = data => post("/wallet/flutterwave", data)

//payment
export const paymentGatewayList = data => get('/settings/payment-gateways', data)
export const postWalletPayment = data => post('/payment/wallet', data)
export const stripePayment = data => post('/payment/stripe', data)
export const paypalPayment = data => post('/payment/paypal', data)
export const flutterwaveTripPayment = data => post("/payment/flutterwave", data)
export const DriverPaymentList = data => get('/payment/list-driver', data)
export const UserPaymentList = data => get('/payment/list-user', data)

// tips
export const postTipsWalletPayment = data => post('/rating/driver/tips-wallet', data)
export const postTipsStripePayment = data => post('/rating/driver/tips-stripe', data)
export const postTipsPaypalPayment = data => post('/rating/driver/tips-paypal', data)

export const deltTicketSettings = data => del('/ticket/settings', data)
export const fetchTicketDepartment = data => get('/ticket/department', data)
export const fetchTicketType = data => get('/ticket/type', data)
export const getTicketPriorities = data => get('/ticket/priorities', data)
export const postTicketPriorities = data => post('/ticket/priorities', data)
export const deleteTicketPriorities = data => del('/ticket/priorities', data)

//wallet
export const getWalletBrief = data => get('wallet/user-wallet-brief', data)
export const getWalletUserHistory = data => get('wallet/list', data)
export const getWalletUserTransaction = data => get('wallet/user-transactions', data)
export const getWalletDepositListAdmin = data => get('wallet/deposit-list', data)
export const delWalletDepositAdmin = data => del('wallet', data)

//language
export const fetchLanguages = data => get('/settings/languages', data)
export const fetchAllLanguages = data => get('/settings/all-languages', data)
export const postLanguage = data => post('/settings/language', data)
export const delLanguage = data => del('/settings/language', data)


// role
export const department = data => get('/user/department/elements', data)
export const DepartmentEmployees = data => get('/user/filtering-employees', data)

export const fetchTranslations = data => get('/settings/language/translations', data)
export const postTranslations = data => post('/settings/language/translations', data)

export const fetchUsers = data => get('/user/list', data)
export const postUserPhoneVerify = data => post('/user/phone/verify', data)
export const delUser = data => del('/user', data)

// Driver
export const fetchDrivers = data => get('/user/driver/list', data);
export const getApprovedDriversRatings = data => get('/rating/driver/list', data);
export const fetchDriverDetails = data => get('/user/driver/details', data);

// driver management
export const fetchDriversPayment = (data) => get("/payment/driver-balance-list", data);
export const delDriversPayment = (data) => del("/payment", data);

// withdraw request
export const fetchWithdrawRequest = (data) => get("/withdraw/list", data);
export const delWithdrawRequest = (data) => del("/withdraw", data);

//Ratings
export const delRating = data => del('/rating/driver', data)
export const postActiveStatus = data => post('/rating/driver', data)
export const getAllRatingAdmin = data => get("/rating/list", data)
export const deleteRatingAdmin = data => del("/rating", data)

// roles api sabbir vai file
export const fetchRoles = data => get('/role/list', data);
export const fetchDepartmentOrCategoryWise = data => get('/role/department-wise-list', data);
export const fetchRole = data => get('/role', data);
export const postRole = data => post('/role', data);
export const delRole = data => del('/role', data);

// new employee api /user/create
export const postEmployee = data => post('/user/employee-create', data);
export const fetchEmployee = data => get('/user/employee-list', data);
export const fetchEmployeeDepartment = data => get('/user/employee/roles', data);

// department
export const postDepartment = data => post('/department', data);
export const fetchDepartmentList = data => get('/department/list', data);
export const fetchDepartmentShortList = data => get('/department/elements', data);
export const fetchDepartment = data => get('/department', data);
export const delDepartment = data => del('/department', data);


// role permissions api
export const postPermissions = data => post('/role/permissions', data);
export const fetchPermissions = data => get('/role/permissions', data);

// driver services
export const postDriverVehicle = data => post('/vehicle', data);
export const updateDriverVehicle = data => post('/vehicle', data);
export const fetchDriverVehicles = data => get('/vehicle/list', data);
export const fetchDriverVehicle = data => get('/vehicle', data);
export const fetchVehicleVerify = data => get('/vehicle/verify', data);
export const fetchVehiclesDriverWise = data => get('/vehicle/driver-wise', data);
export const delVehicle = data => del('/vehicle', data);

// service vehicle
export const fetchServiceVehicleList = data => get('/service/vehicle/list', data);
export const fetchServiceVehiclesShortInfo = data => get('/service/vehicle/list-short-info', data);
export const fetchServiceVehicle = data => get('/service/vehicle', data);
export const postServiceVehicle = data => post('/service/vehicle', data);
export const delServiceVehicle = data => del('/service/vehicle', data);

// vehicle setting
export const postVehicleSetting = data => post('/vehicle/setting', data);
export const fetchVehicleSettings = data => get('/vehicle/setting/list', data);
export const fetchVehicleSetting = data => get('/vehicle/setting', data);

// service category information
export const postCategoryHeading = data => post('/service/category/heading', data);
export const fetchCategoryHeading = data => get('/service/category/heading', data);
export const postCategoryInformation = data => post('/service/category/info', data);
export const getCategoryInformation = data => get('/service/category/info', data);

// fair ( price )
export const fetchServicePrice = data => get('/service-price', data);
export const fetchServicePriceList = data => get('/service-price/list', data);
export const createServicePrice = data => post('/service-price/create', data);
export const fetchOneServicePrice = data => get('/service-price/get-one', data);
export const delServicePrice = data => del('/service-price', data);

// service category
export const postServiceCategory = data => post('/service/category', data);
export const fetchServiceCategories = data => get('/service/category/list', data);
export const fetchServiceCategoryElements = data => get('/service/category/elements', data);
export const delServiceCategory = data => del('/service/category', data);
export const delServiceSetting = data => del('/vehicle/setting', data);

// service list
export const fetchServiceAll = (data) => get('/service/fetch-all', data);
// service package
export const postServicePackage = data => post('/service/package', data);
export const fetchServicePackages = data => get('/service/package/list', data);
export const fetchAllCategoryService = data => get('/service/fetch-all', data);
export const delServicePackage = data => del('/service/package', data);
export const fetchServiceCategoryList = data => get('/service/category-list', data);

// service location
export const postServiceLocation = data => post('/location', data);
export const fetchServiceLocations = data => get('/location/list', data);
export const delServiceLocation = data => del('/location', data);

// services
export const fetchServiceList = data => get('/service/list', data);
export const fetchServiceWiseCategoriesPackages = data => get('/service/service-categories-packages', data);
export const fetchService = data => get('/service', data);
export const postService = data => post('/service', data);
export const delService = data => del('/service', data);

// trips
export const fetchTripsList = data => get('/trip/list', data);
export const fetchTrip = data => get('/trip', data);
export const fetchUserTripList = data => get('/trip/list-user', data);
export const fetchDriverTripList = data => get('/trip/list-driver', data);
export const deleteTrip = data => del('/trip', data);


// frontend data
export const fetchPage = data => get('/page', data);
export const fetchCustomPage = data => get('/page/custom-page', data);
export const postPage = data => post('/page', data);
export const delPage = data => del('/page', data);

// frontend data
export const postHeplPage = data => post('/frontend-data/faq', data);
export const postHelp = data => post('/frontend-data/help', data);
export const fetchHeplPage = data => get('/frontend-data/faq', data);
export const delHeplPage = data => del('/frontend-data/faq', data);


// applications
export const postApplication = data => post('/application/create', data);

export const updateRiderApplicationStatusAPI = (data) => post('/application/update-status', data);

// document dynamic form field
export const postFormFieldAPI = data => post('/form-field', data);
export const fetchFormFields = data => get('/form-field/list', data);
export const delFormField = data => del('/form-field', data);

// services-wise user form fields
export const createUserFormFieldAPI = data => post('/user-form-field/create', data);
export const getAllUserFormFieldAPI = data => get('/user-form-field/get-all', data);
export const getOneUserFormFieldAPI = data => get('/user-form-field/get-one', data);
export const getUserFilteredFormFieldAPI = data => get('/user-form-field/get-specific-role-data', data);
export const updateUserFormFieldAPI = (data, queryValue) => post('/user-form-field/update', data);
export const deleteUserFormFieldAPI = data => del('/user-form-field/delete', data);

// aws file upload
export const postFileToAws = data => post('/file/aws', data);

// operating time
export const postOperatingTime = data => post('/operating-time', data);
export const fetchOperatingTimes = data => get('/operating-time', data);

// attendance
export const postAttendance = data => post('/attendance', data);
export const fetchAttendance = data => get('/attendance', data);
export const fetchAttendancePunch = data => get('/attendance/employee-punch', data);
export const fetchPunchInOut = data => get('/attendance//punch-in-out', data);
export const delAttendance = data => del('/attendance', data);
export const postAttendanceSettings = data => post('/attendance/setting', data);
export const fetchAttendanceSettings = data => get('/attendance/setting', data);
export const delAttendanceSettings = data => del('/attendance/setting', data);

// time sheet
export const postTimeSheet = data => post('/timeSheet', data);
export const fetchTimeSheet = data => get('/timeSheet', data);
export const delTimeSheet = data => del('/timeSheet', data);

// holiday
export const postHoliday = data => post('/holiday', data);
export const fetchHoliday = data => get('/holiday', data);
export const delHoliday = data => del('/holiday', data);

// leave
export const postLeaveSetting = data => post('/leave-setting', data);
export const fetchLeaveSetting = data => get('/leave-setting', data);
export const delLeaveSetting = data => del('/leave-setting', data);
export const postLeave = data => post('/leave', data);
export const fetchLeave = data => get('/leave', data);
export const delLeave = data => del('/leave', data);

// trip
export const postTrip = data => post('/trip', data);


export const fetchPolyline = data => get('/map/polyline', data);
export const postTripList = data => post('/trip/list', data);

// ticket department
export const postTicketDepartment = data => post('/ticket/department', data);
export const postTicketMessage = data => post('/ticket/message', data);
export const postTicketNote = data => post('/ticket/note', data);
export const fetchTicketDepartments = data => get('/ticket/department-list', data);
export const fetchTicketEmployee = data => get('/ticket/employee-list', data);
export const delTicketDepartment = data => del('/ticket/department', data);
export const fetchTicketCategory = data => get('/ticket/department-list?category=true', data)
export const fetchTicketTypes = data => get('/ticket/type-list', data)
export const postTicketType = data => post('/ticket/type', data)
export const delTicketType = data => del('/ticket/type', data);

//group CRUD routes
export const fetchMarketingGroups = data => get('/marketing/groups', data);
export const postMarketingGroup = data => post('/marketing/groups', data);
export const delMarketingGroup = data => del('/marketing/groups', data);

//get users by Group
export const fetchMarketingSubscribers = data => get('/marketing/subscriber', data);
export const postMarketingSubscribers = data => post('/marketing/subscriber', data);
export const fetchAllMarketingUsers = data => get('/marketing/users', data);
export const postMarketingUser = data => post('/marketing/users', data);
export const fetchAvailableSMSUsers = data => get('/marketing/available-user', data);
export const postSMSUsers = data => post('/marketing/available-user', data);

//email configuration & send Route
export const fetchMarketingSettings = data => get('/marketing', data)
export const postMarketingSettings = data => post('/marketing', data)
export const fetchAllMails = data => get('/marketing/all-mail', data);
export const fetchAllSMS = data => get('/marketing/all-sms', data);
export const deliverEmail = data => post('/marketing/deliver-email', data);
export const delMarketingEmail = data => del('/marketing/deliver-email', data);
export const deliverSMS = data => post('/marketing/deliver-sms', data);
export const delMarketingSMS = data => del('/marketing/deliver-sms', data);

//marketing whatsapp
export const fetchAllWhatsappMessage = data => get('/marketing/all-whatsapp-message', data);
export const postWhatsappMessage = data => post('/marketing/deliver-whatsapp-message', data);
export const delWhatsappMessage = data => del('/marketing/deliver-whatsapp-message', data);


//push-notification
export const fetchNotification = data => get('/push-notification/', data);
export const postNotification = data => post('/push-notification/', data);
export const postNotificationSettingJson = data => post('/push-notification/SettingJon', data);

// dashboard-notification
export const fetchDashboardNotification = data => get('/notification', data)
export const postDashboardNotification = data => post('/notification/update', data)

//coupon
export const postCoupon = data => post('/coupon', data);
export const fetchCoupon = data => get('/coupon', data);
export const delCoupon = data => del('/coupon', data);
export const getUserCouponOffers = data => get('/coupon/offer', data)

//Dashboard cards
export const adminDashboardCards = data => get('/user/admin/dashboard', data)
export const driverDashboardCards = data => get('/user/driver/dashboard', data)
export const userDashboardCards = data => get('/user/dashboard', data)

//earning
export const fetchDriverEarning = data => get('/payment/driver-balance-list', data)

//withdraw
export const fetchWithdrawList = data => get('/withdraw/driver-list', data)
export const postWithdrawReq = data => post('/withdraw', data)
export const postWithdrawReqAdmin = data => post('/withdraw/update', data)

// Payroll
export const postPayrollSalarySetting = data => post('/payroll/salary-setting', data);
export const fetchPayrollSalarySettings = data => get('/payroll/salary-setting', data);
export const fetchSalaries = data => get('/payroll/salary-list', data);
export const fetchSalary = data => post('/payroll/salary', data);
export const delSalary = data => del('/payroll/salary', data);
export const fetchSalaryElements = data => get('/payroll/salary-elements', data);
export const delPayrollSalarySetting = data => del('/payroll/salary-setting', data);

export const postPayrollAdvanceSalary = data => post('/payroll/advance-salary', data);
export const fetchPayrollAdvanceSalaries = data => get('/payroll/advance-salary', data);
export const delPayrollAdvanceSalary = data => del('/payroll/advance-salary', data);

// report
export const fetchUsersElement = data => get('/report', data);
export const fetchUsersReport = data => get('/report/users', data);
export const fetchDriversReport = data => get('/report/drivers', data);
export const fetchDriverGraphData = data => get('/report/driver-earning', data);
export const fetchUserExpenseGraphData = data => get('/report/user-expenses', data);
export const fetchCompanyGraphData = data => get('/report/company-earning', data);
export const fetchDonutChartData = data => get('/report/complete-cancel-donut', data);
export const fetchCompanyReport = data => get('/report/company', data);

//paymentList
export const getPaymentListAdmin = data => get('payment/list', data)
export const deletePaymentAdmin = data => del('payment', data)

// get driver my-vehicle
export const fetchDriverDocuments = data => get('/vehicle/driver-document', data);
export const postDriverDocuments = data => post('/vehicle/driver-document', data);

// salary-sheet
export const fetchSalarySheet = data => get('/salary', data)
export const postSalaryGenerate = data => post('/salary-generate', data)
export const postSalarySheet = data => post('/salary', data)
export const delSalarySheet = data => del('/salary', data)

export const postPaySalary = data => post('/pay-salary', data)
export const fetchPaySalaryElements = data => get('/pay-salary-elements', data)
export const fetchPayslip = data => get('/payslip', data)

// user chatting/list
export const sendTripMessage = data => post('/chatting', data);
export const getChatList = data => get('/chatting/list', data);
export const postConfirmRide = data => post('/trip', data);
export const postRideCoupon = data => post('/coupon/apply', data);
export const fetchSourceToDestinationDistance = data => post('/vehicle/fare-distance', data);
export const fetchPaymentGateways = data => get('/settings/payment-gateways', data);
export const fetchServiceTransports = data => get('/service/category-wise-list', data);
export const fetchNearestVehicleDetails = data => get('/vehicle/details', data);
export const fetchFare = data => post('/vehicle/fare', data);
export const fetchNearestVehicles = data => post('/vehicle/nearest-vehicle-search', data);

// driver trip/update-by-driver
export const activeAndUpdateDriverLocation = data => post('/vehicle/update-active-status', data);
export const fetchDriverData = data => get('/user/driver/dashboard', data);
export const fetchOnGoingRide = data => get('/trip/ongoing', data);
export const paymentChecking = data => get('/payment/check', data);
export const tripStatusUpdate = data => post('/trip/update-by-driver', data);
export const postReview = data => post('/rating/driver', data);

export const postCancelTripRequest = data => post('/trip/cancel', data);
