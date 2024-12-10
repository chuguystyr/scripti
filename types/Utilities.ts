export type SearchParams = {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export type Params = { params: Promise<{ major: string }> }

export type BasicPageProps = SearchParams & Params

export enum SignUpFormValidationErrors {
  EMPTY_MANDATORY_FIELD = "Please fill in\nall mandatory fields.",
  INVALID_EMAIL = "Please enter a valid email address.",
  WEAK_PASSWORD = "Password must have 8-20 characters, including an uppercase letter, a lowercase letter, a digit, and a special character.",
  USERNAME_TAKEN = "Username is already taken.",
  INTERNAL_ERROR = "Something went wrong.\nPlease try again later.",
}

export enum LoginFormValidationErrors {
  EMPTY_MANDATORY_FIELD = "Please fill in\nall fields.",
  INVALID_CREDENTIALS = "Invalid credentials.",
  INTERNAL_ERROR = "Something went wrong.\nPlease try again later.",
}

export enum SetCourseValidationErrors {
  EMPTY_MANDATORY_FIELD = "Please fill in\nall mandatory fields.",
  COURSE_EXISTS = "Course with this name already exists.",
}
