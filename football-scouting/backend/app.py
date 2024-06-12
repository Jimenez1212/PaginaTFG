from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# cargar modelo y el scaler
with open('linear_regression_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

# caracteristicas por posicion 
position_features = {
    'Portero': ['edad', 'entradas', 'intercepciones', 'despejes', 'balones_perdidos', 'controles_malos'],
    'Defensa': ['edad', 'entradas', 'intercepciones', 'despejes', 'balones_perdidos', 'pases_por_partido', 'acierto_pases%', 'centros_por_partido'],
    'Mediocampista': ['edad', 'goles', 'asistencias', 'regates', 'pases_por_partido', 'acierto_pases%', 'pases_clave', 'centros_por_partido', 'balones_largos_por_partido', 'pases_al_hueco_por_partido'],
    'Delantero': ['edad', 'goles', 'asistencias', 'regates', 'fueras_de_juego', 'tiros_por_partido', 'balones_perdidos', 'pases_por_partido', 'acierto_pases%', 'centros_por_partido']
}

# todas las caracteristicas 
all_features = [
    'edad', 'entradas', 'intercepciones', 'despejes', 'balones_perdidos', 'controles_malos', 'pases_clave', 
    'pases_por_partido', 'acierto_pases%', 'centros_por_partido', 'goles', 'asistencias', 'tiros_por_partido',
    'regates', 'balones_largos_por_partido', 'pases_al_hueco_por_partido', 'fueras_de_juego'
]

def categorize_position(position):
    if 'POR' in position:
        return 'Portero'
    elif 'DF' in position:
        return 'Defensa'
    elif 'ME' in position or 'MC' in position:
        return 'Mediocampista'
    elif 'DL' in position or 'MP' in position:
        return 'Delantero'
    else:
        return 'Other'

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    players = data['players']

    if not players:
        return jsonify({'predicted_ratings': []})
    
    features_list = []
    for player in players:
        position_category = categorize_position(player['position'])
        features_dict = {feature: 0 for feature in all_features}
        for key, value in player['features'].items():
            if key in position_features[position_category]:
                features_dict[key] = value
        features_list.append(features_dict)
    
    # connvertir en df y ordenar
    features_df = pd.DataFrame(features_list, columns=all_features)
    
    features_scaled = scaler.transform(features_df)  
    predictions = model.predict(features_scaled)
    
    # aplicar una transformacion suave en lugar de clipping abrupto
    predictions = np.clip(predictions, 0, 10)
    
    return jsonify({'predicted_ratings': predictions.tolist()})

if __name__ == '__main__':
    app.run(debug=True)


#python app.py