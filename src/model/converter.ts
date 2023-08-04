import type { Utilisateur } from '@model/type';
import type { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase/firestore';

export const utilisateurConverter: FirestoreDataConverter<Utilisateur> = {
    toFirestore: (item) => item,
    fromFirestore: (snapshot: QueryDocumentSnapshot<Utilisateur>, options):Utilisateur => {
      return snapshot.data()
    }
};