
def course_to_dict(course):
    return {
        "id": course.id,
        "sensei_id": course.sensei_id,
        "name": course.name,
        "description": course.description,
        "hours": course.hours,
        "miniature_id": course.miniature_id,
        "video_id": course.video_id,
        "price": course.price
    }

