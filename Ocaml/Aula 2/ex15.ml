let rec belongs v l =
	match l with
	 [] -> false
	| x::xs -> if x = v then true else belongs v xs
;;

let rec union l1 l2 =
	match l1 with
	 [] -> l2
	| x::xs -> if belongs x l2 then union xs l2 else x:: union xs l2
;;

let rec inter l1 l2 =
	match l1 with
	 [] -> []
	| x::xs -> if not belongs x l2 then inter xs l2 else x:: inter xs l2
;;

let rec diff l1 l2 =
	match l1 with
	 [] -> l2
	| x::xs -> if not belongs x l2 then x:: diff xs l2 else diff xs l2
;;

let rec power l =
	match l with
	 [] -> [[]]
	| x::xs -> power xs @ [x] @ l
;;

(*resolução do professor*)

let rec ins v ll =
	match ll with
	 [] -> []
	|l::ls -> (v::l) :: ins v ls
;;

let rec power l = 
	match l with
	 [] -> [[]]
	| x::xs -> ins x (power xs) @ power xs
;;
