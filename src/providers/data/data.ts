import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';


@Injectable()
export class DataProvider {

	database: SQLiteObject = null;
  
  constructor() {}


  //Cette fonction permet de lister les tables qui
  //seront créées
  listTablesOfApp(){
    let tabs = ['client','contact','tribunal','res_client', 'res_contact', 'res_tribunal', 'res_client_contact', 'nature', 'type_hearing', 'briefcase', 'type_task', 'lang', 'tag_project','tag_agenda', 'remind', 'statut', 'ona_hearing', 'stage_task', 'avocat', 'offline', 'notes', 'audiences', 'tasks', 'note_stage', 'stage', 'tags', 'stage_briefcase', 'agenda', 'user', 'invoice'];

    return tabs;

  }

  /**
   * On fixe l'Objet SQLiteObject
   * si ce dernier n'existe pas
   *
   **/
  setDatabase(db: SQLiteObject){
    
    if(this.database === null){
      this.database = db;
    }
  }

 	//Cette fonction permet de créer
 	//une table dans la bd sqlite
 	//@param <nom_table> string - nom de la table
 	////@return Objet SQLObject
   createPartnerTable(nom_table){

     let query = "CREATE TABLE IF NOT EXISTS "+nom_table+" (id INTEGER PRIMARY KEY AUTOINCREMENT, idx, name, last_name, middle_name, city, street, email, phone, mobile, website, fax, ref, title, lang, bitcs_genre, birthdate, doc_count, image_url, active, parent_id, invoice_count, credit)";

     this.database.executeSql(query)
      .then(() => console.log('Executed SQL'))
      .catch(e => console.log(e)); 
   }
 
 	//On créé la fonction pour insérer les données
 	//dans la table <nom_table>
 	//@param objet <Object>
 	//@param nom_table <string>
  //@return Objet SQLObject
   insertPartner(objet, nom_table){
    
    let insert_query = "INSERT INTO "+nom_table+" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    let tab = [];

    tab.push(objet.id,objet.name, objet.last_name, objet.middle_name, objet.city);
    tab.push(objet.street, objet.email, objet.phone, objet.mobile);
    tab.push(objet.website, objet.fax, objet.ref, objet.title, objet.lang, objet.bitcs_genre, objet.birthdate, objet.doc_count, objet.image_url, objet.active, objet.parent_id, objet.invoice_count, objet.credit);
     	    
	    return this.database.executeSql(insert_query, tab);
    
   }
 
   /**
    * Cette fonction permet d'enregistrer plusieurs
    * partner
    * @param liste Array<JSONObject>
    *
    **/
   insertMultiplePartner(liste, nom_table){

      for (let i = 0; i < liste.length; i++) {
        this.insertPartner(liste[i], nom_table).then((res)=>{

        });
      }
   }
 	
 	//On récupère la liste des objets
 	//@param nom_table <string>
  //@return Objet SQLObject
  fetchFromPartner(nom_table){

    let req = "SELECT * FROM "+nom_table+"";
	   	
	  return this.database.executeSql(req, []).then((data) => {
      
      let objets = [];
      
      if (data.rows.length > 0) {

        for (var i = 0; i < data.rows.length; i++) {
          objets.push({
                id: data.rows.item(i).idx,
                name:  data.rows.item(i).name,
                middle_name:  data.rows.item(i).middle_name,
                last_name:  data.rows.item(i).last_name,
                city:  data.rows.item(i).city,
                street:  data.rows.item(i).street,
                email:  data.rows.item(i).email,
                phone:  data.rows.item(i).phone,
                mobile:  data.rows.item(i).mobile,
                website:  data.rows.item(i).website,
                fax:  data.rows.item(i).fax,
                ref:  data.rows.item(i).ref,
                title: data.rows.item(i).title, 
                lang: data.rows.item(i).lang, 
                bitcs_genre: data.rows.item(i).bitcs_genre,
                birthdate: data.rows.item(i).birthdate,
                doc_count: data.rows.item(i).doc_count,
                image_url: data.rows.item(i).image_url,
                active: data.rows.item(i).active,
                parent_id: data.rows.item(i).parent_id,
                invoice_count: data.rows.item(i).invoice_count,
                credit: data.rows.item(i).credit
          }); 
      				 
        }

      }

      return Promise.resolve(objets);

    }).catch(error => Promise.reject(error));

   }

    /**
     * Cette fonction permet de supprimer 
     * un élément de la table <nom_table
     * @param objet <Object>, client tribunal ou contact
     **/
    deletePartner(objet, nom_table){
      let sql = 'DELETE FROM '+nom_table+' WHERE idx=?';
      return this.database.executeSql(sql, [objet.idx]);
    }

   //Cette fonction permet de
   //mettre à jour les données d'un objet sqlite, lorsque l'utilisateur
   //est connecté
   //
   //@param objet <Object>
   //@param nom_table <string>
   //@return SQLObject
   updateFromRemote(objet, nom_table){
	
	let query = 'UPDATE '+nom_table+' SET name=?, last_name=?, middle_name=?, city=?, street=?, email=?, phone=?, mobile=?, website=?, fax=?, ref=?, title=?, lang=?, bitcs_genre=?, birthdate=?, doc_count=?, image_url=?, active=?, parent_id=?, invoice_count=?, credit=?, WHERE idx=?';
	
	let tab = [];

    tab.push(objet.name, objet.last_name, objet.middle_name, objet.city);
    tab.push(objet.street, objet.email, objet.phone, objet.mobile);
    tab.push(objet.website, objet.fax, objet.ref, objet.title, objet.lang, objet.bitcs_genre, objet.birthdate, objet.doc_count, objet.image_url, objet.active, objet.parent_id, objet.invoice_count, objet.credit, objet.id);
     	    
    return this.database.executeSql(query, tab);

   }
 
  

}
