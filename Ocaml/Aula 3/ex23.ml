type 'a tree = Nil | Node of 'a * 'a tree * 'a tree;;

let rec belongsTree v l =
	match l with
	 [] -> false
	| x::xs -> if x = v then true else belongsTree v xs
;;

let rec clear l1 l2 =
	match l1 with
	 [] -> l2
	| x::xs -> if belongsTree x l2 then clear xs l2 else x::clear xs l2
;;

let rec subtrees t =
	match t with
	 Nil -> [Nil]
	| Node(x,l,r) -> Node(x,l,r)::clear (subtrees l) (subtrees r)
;;   


