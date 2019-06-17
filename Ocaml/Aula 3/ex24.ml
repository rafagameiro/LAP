type 'a tree = Nil | Node of 'a * 'a tree * 'a tree;;

let rec spring v t =
	match t with
	 Nil -> Node(v,Nil,Nil)
	|Node(x,l,r) -> Node(x,spring v l, spring v r)
;;
