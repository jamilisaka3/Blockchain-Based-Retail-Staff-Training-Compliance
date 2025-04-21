;; Training Requirement Contract
;; Defines mandatory employee education

(define-data-var admin principal tx-sender)

;; Map of training module IDs to their details
(define-map training-modules
  { module-id: (string-ascii 20) }
  {
    title: (string-ascii 50),
    description: (string-ascii 200),
    required: bool,
    duration-minutes: uint,
    expiration-days: uint
  }
)

;; Add a new training module
(define-public (add-training-module
    (module-id (string-ascii 20))
    (title (string-ascii 50))
    (description (string-ascii 200))
    (required bool)
    (duration-minutes uint)
    (expiration-days uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-none (map-get? training-modules { module-id: module-id })) (err u100))
    (ok (map-set training-modules
      { module-id: module-id }
      {
        title: title,
        description: description,
        required: required,
        duration-minutes: duration-minutes,
        expiration-days: expiration-days
      }
    ))
  )
)

;; Update an existing training module
(define-public (update-training-module
    (module-id (string-ascii 20))
    (title (string-ascii 50))
    (description (string-ascii 200))
    (required bool)
    (duration-minutes uint)
    (expiration-days uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (asserts! (is-some (map-get? training-modules { module-id: module-id })) (err u404))
    (ok (map-set training-modules
      { module-id: module-id }
      {
        title: title,
        description: description,
        required: required,
        duration-minutes: duration-minutes,
        expiration-days: expiration-days
      }
    ))
  )
)

;; Get training module details
(define-read-only (get-training-module (module-id (string-ascii 20)))
  (map-get? training-modules { module-id: module-id })
)

;; Check if a module is required
(define-read-only (is-module-required (module-id (string-ascii 20)))
  (match (map-get? training-modules { module-id: module-id })
    module-data (some (get required module-data))
    none
  )
)

;; Transfer admin rights
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (var-set admin new-admin))
  )
)
