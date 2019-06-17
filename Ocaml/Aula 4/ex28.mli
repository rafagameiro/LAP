(* Module interface BTree*)

type tree;; (* abstract *)

val make : int list -> tree				(* Cria uma árvore com os elementos da lista, alinhados para a direita  *)
val max : tree -> int					(* Determina o valor maior que ocorre numa árvore *função parcial) *)
val load : 	string -> tree				(* Carrega uma árvore a partir dum ficheiro de texto *)
val store : string -> tree -> unit		(* Escreve uma árvore num ficheiro de texto *)
val show : tree -> unit					(* Mostra uma árvore na consola *)
val isEmpty : tree -> bool
