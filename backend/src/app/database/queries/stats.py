from app.database.base import Purchase
from app.database.queries.courses import get_course_by_id
from app.database.queries.user import get_all_users
from sqlalchemy import func

def get_stats(db):
    results = (
        db.query(Purchase.course_id, func.count(Purchase.id).label("sales"))
        .group_by(Purchase.course_id)
        .all()
    )

    sales_dict = {course_id: sales for course_id, sales in results}
    total_profits: int = 0
    course_profits: dict = {}

    for id, x in sales_dict.items():
        course = get_course_by_id(db, id)
        course_data = course["course_data"]
        price = course_data['price']
        profits = x * price
        print(f"Course ID: {id}, Sales: {x}, Price: {price}, Profits: {profits}")
        course_profits[id] = profits
        total_profits += profits



    response = {
        "total_users": len(get_all_users(db)),
        "total_profits": total_profits,
        "profits_by_course": course_profits
    }

    return response 
