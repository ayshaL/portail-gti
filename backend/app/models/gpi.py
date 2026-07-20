def compute_gpi(assiduite: float, productivite: float, qualite: float | None, depassement: float | None) -> float:
    """
    Chaque dimension est attendue sur une échelle 0-100.
    Retourne le score global pondéré, arrondi à 1 décimale.
    """
    valid_args = [assiduite, productivite]
    
    if qualite is not None:
        valid_args.append(qualite)
        
    if depassement is not None:
        valid_args.append(-depassement)
    
    score = sum(valid_args) / len(valid_args)

    return round(score, 2)