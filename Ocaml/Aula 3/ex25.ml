type 'a tree = Nil | Node of 'a * 'a tree * 'a tree;;

let rec fall t =
	match t with
	 Nil -> Nil
	| Node(x,l,r) -> if l = Nil && r = Nil then Nil else Node(x,fall l,fall r)
;;

(*melhor ainda!!*)

let rec fall t =
	match t with
	 Nil -> Nil
	| Node(x,Nil,Nil) -> Nil
	| Node(x,l,r) -> Node(x,fall l,fall r)
;;
