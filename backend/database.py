from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Database Connection Setup (Creates a local file database)
DATABASE_URL = "sqlite:///./abi_data.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# 2. Define your Business Metrics Table Structure
class MonthlyMetric(Base):
    __tablename__ = "monthly_metrics"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, unique=True, index=True)  # e.g., "July 2026"
    gross_revenue = Column(Float)
    growth_rate = Column(String)                     # e.g., "12%"

# 3. Helper to initialize and populate the DB with fake hackathon data
def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have data so we don't duplicate it
    if db.query(MonthlyMetric).count() == 0:
        print("🗄️ Initializing database with sample financial records...")
        sample_data = [
            MonthlyMetric(month="May 2026", gross_revenue=38000.0, growth_rate="5%"),
            MonthlyMetric(month="June 2026", gross_revenue=40000.0, growth_rate="8%"),
            MonthlyMetric(month="July 2026", gross_revenue=45000.0, growth_rate="12%"),
        ]
        db.add_all(sample_data)
        db.commit()
    db.close()

if __name__ == "__main__":
    init_db()
    print(" Database successfully created and seeded!")