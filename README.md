```
gpi-performance-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── KpiCard.jsx
│   │   │   ├── EmployeeRow.jsx
│   │   │   ├── Sparkline.jsx
│   │   │   └── charts/
│   │   │       ├── RadarGpi.jsx
│   │   │       └── TrendChart.jsx
│   │   ├── views/
│   │   │   ├── DashboardView.jsx
│   │   │   ├── EmployeesView.jsx
│   │   │   └── DetailView.jsx
│   │   ├── services/
│   │   │   └── api.js          # appels axios vers le backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── main.py             # point d'entrée FastAPI
│   │   ├── routers/
│   │   │   ├── employees.py    # CRUD collaborateurs
│   │   │   └── predictions.py  # endpoints GPI + prédiction
│   │   ├── models/
│   │   │   ├── schemas.py      # modèles Pydantic (entrée/sortie API)
│   │   │   └── gpi.py          # calcul du score GPI
│   │   ├── ml/
│   │   │   ├── train_model.py  # script d'entraînement
│   │   │   ├── predict.py      # chargement + inférence
│   │   │   └── trained_model.pkl
│   │   └── database.py         # connexion DB (si utilisée)
│   ├── requirements.txt
│   └── data/
│       └── historique.csv      # données d'entraînement
│
├── .gitignore
└── README.md
```
