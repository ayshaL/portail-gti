# just to get an idea of the strcuture of the code
# prob is how to connect to database --> network / vpn / pc de bureau (which I hate)

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "sqlite:///./gpi.db"

DATABASE_URL = "sqlite:///./test_rounded.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# test the db connection
try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        print(" Successfully connected to the database!")
except Exception as e:
    print(f" Failed to connect to the database: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()