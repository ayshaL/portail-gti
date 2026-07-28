# just to get an idea of the strcuture of the code
# prob is how to connect to database --> network / vpn / pc de bureau (which I hate)

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

# DATABASE_URL = "sqlite:///./gpi.db"

DATABASE_URL = "sqlite:///./test.db"

# DATABASE_URL = "oracle+oracledb://INTRANET_GTI_TEST:JSSnYH10@192.168.107.229:1521/?sid=DB19ORCL"

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


# my database credentials


# url : jdbc:oracle:thin:@192.168.107.229:1521:DB19ORCL
# login : INTRANET_GTI_TEST
# pwd : JSSnYH10

# my main tables

# -- présence,retard
# select * from DETAILS_ASSIDUITE a where a.USR_MATRICULE='4244';
#  
# -- Vélocité=Productivité , Respect des délais=dépassement
# select * from RENDEMENT_RESSOURCE;
#  
# -- liste des utilisateurs
# select * from UTILISATEUR;
# 
# -- table create by me: prod, qual, depass par mois pour tous les collaborateurs
# select * from RENDEMENT_MENSUEL;
# 
