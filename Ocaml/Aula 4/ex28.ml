(* Module body BinTree *)

type tree = Nil | Node of int * tree * tree ;;

let rec make l =
	match l with
	 [] -> Nil
	| x::xs -> Node(x, Nil, make xs)
;;

let rec max t = (* pre: t <> Nil *)
	match t with
	 Nil -> failwith "max: empty"
	| Node(x,Nil,Nil) -> x
	| Node(x,Nil,r) -> Pervasives.max x (max r)
	| Node(x,l,Nil) -> Pervasives.max x (max l)
	| Node(x,l,r) -> Pervasives.max x ( Pervasives.max (max l) (max r))
;;

(*Também pode se usar desta forma, para o caso de usarmos arvores n-árias com n > 2*)

let max t = maxList ( treeToList t );;

let rec loadChannel ci =
	try
		let s = input_line ci in
			if s = "-" then 
				Nil 
			else
				let l = loadChannel ci in
					let r = loadChannel ci in
					 Node(int_of_string s,l,r)
	with End_of_file -> failwith "loadChannel: empty"
;;

let rec load ni =
	let ci = open_in ni in
		let t = loadChannel ci in
			close_in ci ; t
;;

let rec storeChannel co t =
	match t with
	 Nil -> output_string "-\n"
	| Node(x,l,r) -> output_string( (string_of_int x) ^ "\n") ; storeChannel co l ; storeChannel co r
;;

let store no t =
	let co = open_out no in
		storeChannel co t;
		close_out co
;;

let show t = storeChannel stdout t;;

let isEmpty t = t = Nil;;
