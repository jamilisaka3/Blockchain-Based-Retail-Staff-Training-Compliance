;; Completion Tracking Contract
;; Records finished training modules

(define-data-var admin principal tx-sender)

;; Map to track employee training completions
(define-map training-completions
  {
    employee-id: (string-ascii 20),
    module-id: (string-ascii 20)
  }
  {
    completed-at: uint,
    expires-at: uint,
    score: uint
  }
)

;; Record a completed training module
(define-public (record-completion
    (employee-id (string-ascii 20))
    (module-id (string-ascii 20))
    (score uint)
    (expiration-days uint))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (let
      (
        (current-time (unwrap-panic (get-block-info? time u0)))
        (expiration-time (+ current-time (* expiration-days u86400)))
      )
      (ok (map-set training-completions
        {
          employee-id: employee-id,
          module-id: module-id
        }
        {
          completed-at: current-time,
          expires-at: expiration-time,
          score: score
        }
      ))
    )
  )
)

;; Check if a training module is completed and not expired
(define-read-only (is-module-completed
    (employee-id (string-ascii 20))
    (module-id (string-ascii 20)))
  (match (map-get? training-completions { employee-id: employee-id, module-id: module-id })
    completion-data
      (let
        (
          (current-time (unwrap-panic (get-block-info? time u0)))
          (expires-at (get expires-at completion-data))
        )
        (if (< current-time expires-at)
          (some true)
          (some false)
        )
      )
    none
  )
)

;; Get completion details
(define-read-only (get-completion-details
    (employee-id (string-ascii 20))
    (module-id (string-ascii 20)))
  (map-get? training-completions { employee-id: employee-id, module-id: module-id })
)

;; Transfer admin rights
(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-eq tx-sender (var-get admin)) (err u403))
    (ok (var-set admin new-admin))
  )
)
