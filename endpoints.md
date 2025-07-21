# auth


[x]POST
/auth/register
Register


[x]POST
/auth/login
Login

[x]POST
/auth/logout
Logout


[x]GET
/auth/get_users
Get Users

# courses


[x]GET
/courses/mtd_courses
Get Mtd Courses


[x]GET
/courses/course_content
Get Course Content


GET
/courses/my_courses
My Courses


[x]POST
/courses/buy_course
Buy Course


[x]POST
/courses/webhook
Stripe Webhook

# forums


POST
/forums/create_thread/
Create New Thread


DELETE
/forums/delete_thread/
Delete Thread


GET
/forums/mtd_threads/
Mtd Threads


POST
/forums/send_message/
Send Message


GET
/forums/messages_thread/
Messages Thread

# media


GET
/media/get_file
Get Files Gd

# workbrench


POST
/workbrench/new_course
Create Course


DELETE
/workbrench/delete_course/{course_id}
Del Course


POST
/workbrench/new_section/{course_id}
Create Section


DELETE
/workbrench/delete_section/{section_id}
Delete Section


POST
/workbrench/add_lesson
New Lesson


POST
/workbrench/delete_lesson/{file_id}/{lesson_id}
Delete Lesson


POST
/workbrench/edit_metadata
Edit Metadata


POST
/workbrench/give_course
Give Course

# support


[x] POST
/support/send_email
Send Email